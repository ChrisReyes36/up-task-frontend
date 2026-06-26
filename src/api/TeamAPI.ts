import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { TeamMembersSchema } from "../types/index";
import {
  TeamMemberSchema,
  type Project,
  type TeamMember,
  type TeamMemberForm,
} from "@/types";

type TaskAPI = {
  formData: TeamMemberForm;
  projectId: Project["_id"];
  id: TeamMember["_id"];
};

export async function finUserByEmail({
  projectId,
  formData,
}: Pick<TaskAPI, "formData" | "projectId">) {
  try {
    const { data } = await api.post(
      `/projects/${projectId}/team/find`,
      formData,
    );
    const response = TeamMemberSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function addUserToProject({
  projectId,
  id,
}: Pick<TaskAPI, "projectId" | "id">) {
  try {
    const { data } = await api.post<string>(`/projects/${projectId}/team`, {
      id,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function getProjectTeam(projectId: Project["_id"]) {
  try {
    const { data } = await api.get(`/projects/${projectId}/team`);
    const response = TeamMembersSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function removeUserToProject({
  projectId,
  id: userId,
}: Pick<TaskAPI, "projectId" | "id">) {
  try {
    const { data } = await api.delete<string>(
      `/projects/${projectId}/team/${userId}`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}
