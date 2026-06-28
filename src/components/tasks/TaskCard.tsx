import { useNavigate, useParams } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDraggable } from "@dnd-kit/react";
import type { Task } from "@/types";
import { deleteTask } from "@/api/TaskAPI";

type TaskCardProps = {
  task: Task;
  canEdit: boolean;
};

export default function TaskCard({ task, canEdit }: TaskCardProps) {
  const { ref } = useDraggable({
    id: task._id,
    data: {
      taskId: task._id,
      currentStatus: task.status,
    },
    disabled: !canEdit,
  });
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      toast.success(data);
    },
  });

  return (
    <li
      ref={ref}
      className="p-5 bg-white border-slate-300 flex justify-between gap-3"
    >
      <div className="min-w-0 flex flex-col gap-y-4">
        <button
          type="button"
          className="text-xl font-bold text-slate-600 text-left"
          onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
        >
          {task.name}
        </button>
        <p className="text-slate-500">{task.description}</p>
      </div>
      <div className="flex shrink-0  gap-x-6">
        <Menu as="div" className="relative">
          <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900">
            <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-xl border border-gray-900/5 bg-white p-1 text-sm shadow-lg focus:outline-none
              transition duration-100 ease-out
              data-[closed]:scale-95 data-[closed]:opacity-0
              data-[enter]:ease-out data-[enter]:duration-100
              data-[leave]:ease-in data-[leave]:duration-75"
          >
            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-gray-900 ${
                    focus ? "bg-gray-100" : ""
                  }`}
                  onClick={() =>
                    navigate(location.pathname + `?viewTask=${task._id}`)
                  }
                >
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                  Ver Tarea
                </button>
              )}
            </MenuItem>

            {canEdit && (
              <>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-gray-900 ${
                        focus ? "bg-gray-100" : ""
                      }`}
                      onClick={() =>
                        navigate(location.pathname + `?editTask=${task._id}`)
                      }
                    >
                      <PencilIcon className="h-4 w-4 text-gray-400" />
                      Editar Tarea
                    </button>
                  )}
                </MenuItem>

                <div className="my-1 h-px bg-gray-900/5" />

                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-red-500 ${
                        focus ? "bg-red-50" : ""
                      }`}
                      onClick={() => mutate({ taskId: task._id, projectId })}
                    >
                      <TrashIcon className="h-4 w-4 text-red-400" />
                      Eliminar Tarea
                    </button>
                  )}
                </MenuItem>
              </>
            )}
          </MenuItems>
        </Menu>
      </div>
    </li>
  );
}
