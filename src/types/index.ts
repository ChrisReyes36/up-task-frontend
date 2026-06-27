import { z } from "zod";
/** Auth & Users */
export const AuthSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

export type Auth = z.infer<typeof AuthSchema>;

export type UserLoginForm = Pick<Auth, "email" | "password">;

export type UserRegistrationForm = Pick<
  Auth,
  "email" | "name" | "password" | "password_confirmation"
>;

export type ConfirmToken = Pick<Auth, "token">;

export type RequestConfirmationCodeForm = Pick<Auth, "email">;

export type ForgotPasswordForm = Pick<Auth, "email">;

export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;

/** Users */
export const UserSchema = AuthSchema.pick({ name: true, email: true }).extend({
  _id: z.string(),
});

export type User = z.infer<typeof UserSchema>;

/** Notes */
export const NoteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: UserSchema,
  task: z.string(),
  createdAt: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;

export type NoteFormData = Pick<Note, "content">;

/** Tasks */
export const TaskStatusSchema = z.enum([
  "pending",
  "onHold",
  "inProgress",
  "underReview",
  "completed",
]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: TaskStatusSchema,
  completedBy: z.array(
    z.object({
      _id: z.string(),
      user: UserSchema,
      status: TaskStatusSchema,
    }),
  ),
  notes: z.array(NoteSchema.extend({ createdBy: UserSchema })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

export type TaskFormData = Pick<Task, "name" | "description">;

/** Projects */
export const ProjectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: z.union([z.string(), UserSchema.pick({ _id: true })]),
});

export const DashboardProjectSchema = z.array(
  ProjectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  }),
);

export type Project = z.infer<typeof ProjectSchema>;

export type ProjectFormData = Pick<
  Project,
  "clientName" | "projectName" | "description"
>;

/** Team */
export const TeamMemberSchema = UserSchema.pick({
  name: true,
  email: true,
  _id: true,
});

export const TeamMembersSchema = z.array(TeamMemberSchema);

export type TeamMember = z.infer<typeof TeamMemberSchema>;

export type TeamMemberForm = Pick<TeamMember, "email">;
