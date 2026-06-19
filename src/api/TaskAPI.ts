import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { TaskFormData, Project, Task } from "../types/index";

type TaskAPI = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
};

export async function createTask({
  formData,
  projectId,
}: Pick<TaskAPI, "formData" | "projectId">) {
  try {
    const { data } = await api.post<string>(
      `/projects/${projectId}/tasks`,
      formData,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function updateTask({
  formData,
  projectId,
  taskId,
}: Pick<TaskAPI, "formData" | "projectId" | "taskId">) {
  try {
    const { data } = await api.put<string>(
      `/projects/${projectId}/tasks/${taskId}`,
      formData,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    const { data } = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}
