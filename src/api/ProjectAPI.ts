import { isAxiosError } from "axios";
import api from "@/lib/axios";
import {
  DashboardProjectSchema,
  type Project,
  type ProjectFormData,
} from "@/types";

export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post<string>("/projects", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function getProjects() {
  try {
    const { data } = await api.get("/projects");
    const response = DashboardProjectSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function getProjectById(projectId: Project["_id"]) {
  try {
    const { data } = await api.get(`/projects/${projectId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

export async function updateProject({ formData, projectId }: ProjectAPIType) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function deleteProject(projectId: Project["_id"]) {
  try {
    const { data } = await api.delete<string>(`/projects/${projectId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}
