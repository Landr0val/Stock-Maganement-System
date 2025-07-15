import { CreateUserSchema, UpdateUserSchema, UserResponseSchema, UserWithEmailAndPassword } from "../schemas/user.schema";
import { z } from "zod";

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserWithEmailAndPassword = z.infer<typeof UserWithEmailAndPassword>;
