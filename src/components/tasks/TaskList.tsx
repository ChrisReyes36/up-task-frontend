import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { Feedback, type DragDropManager } from "@dnd-kit/dom";
import type { Plugins } from "@dnd-kit/abstract";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateStatus } from "@/api/TaskAPI";
import { type Task, TaskStatusSchema, type TaskStatus } from "@/types";
import { statusTranslations } from "@/locales/es";
import TaskCard from "./TaskCard";
import DropTask from "./DropTask";

type TaskListProps = {
  tasks: Task[];
  canEdit: boolean;
};

type GroupTask = {
  [key in TaskStatus]: Task[];
};

type ProjectDetails = {
  tasks: Task[];
};

const initialStatusGroup: GroupTask = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const taskStatuses = Object.keys(initialStatusGroup) as TaskStatus[];

const statusStyles: { [key in TaskStatus]: string } = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-amber-500",
  completed: "border-t-emerald-500",
};

const disableDropAnimation = (plugins: Plugins<DragDropManager>) =>
  plugins.map((plugin) =>
    plugin === Feedback ? Feedback.configure({ dropAnimation: null }) : plugin,
  );

export default function TaskList({ tasks, canEdit }: TaskListProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onMutate: ({ taskId, status }) => {
      const queryKey = ["editProject", projectId];

      queryClient.cancelQueries({ queryKey });

      const previousProject =
        queryClient.getQueryData<ProjectDetails>(queryKey);

      queryClient.setQueryData<ProjectDetails>(queryKey, (project) => {
        if (!project) return project;

        return {
          ...project,
          tasks: project.tasks.map((task) =>
            task._id === taskId ? { ...task, status } : task,
          ),
        };
      });

      return { previousProject };
    },
    onError: (error, _variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["editProject", projectId],
          context.previousProject,
        );
      }

      toast.error(error.message);
    },
    onSuccess: (data, variables) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
    },
  });

  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroup);

  const handleDragEnd = (event: DragEndEvent) => {
    const source = event.operation.source;
    const target = event.operation.target;

    if (!source || !target || !canEdit) return;

    const taskId = source.data.taskId;
    const currentStatus = TaskStatusSchema.safeParse(source.data.currentStatus);
    const status = TaskStatusSchema.safeParse(target.data.status);

    if (typeof taskId !== "string") return;
    if (!currentStatus.success || !status.success) return;
    if (currentStatus.data === status.data) return;

    const drop = event.suspend();
    mutate({ projectId, taskId, status: status.data });
    requestAnimationFrame(() => drop.resume());
  };

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DragDropProvider
          plugins={disableDropAnimation}
          onDragEnd={handleDragEnd}
        >
          {taskStatuses.map((status) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <h3
                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>

              <DropTask status={status} canEdit={canEdit} />

              <ul className="mt-5 space-y-5">
                {groupedTasks[status].length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  groupedTasks[status].map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DragDropProvider>
      </div>
    </>
  );
}
