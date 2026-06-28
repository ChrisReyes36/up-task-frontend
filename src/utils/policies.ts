import type { Project, TeamMember } from "@/types";

const getUserId = (user: Project["manager"]) =>
  typeof user === "string" ? user : user._id;

export const isManager = (
  managerId: Project["manager"],
  userId: TeamMember["_id"],
) => getUserId(managerId) === userId;
