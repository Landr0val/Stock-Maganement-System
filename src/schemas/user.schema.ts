import { UserRole } from "../utils/roles";
import { z } from "zod";

export const CreateUserSchema = z.object({
    first_name: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
    last_name: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
    email: z.string().email("Invalid email format").max(100, "Email must be less than 100 characters"),
    phone_number: z.coerce.bigint(),
    role: z.nativeEnum(UserRole),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
});

export const UpdateUserSchema = z.object({
    email: z.string().email("Invalid email format").max(100, "Email must be less than 100 characters").optional(),
    phone_number: z.coerce.bigint().optional(),
    role: z.nativeEnum(UserRole).optional(),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters").optional(),
})

export const UserResponseSchema = z.object({
    id: z.string().ulid("Invalid user ID format"),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone_number: z.bigint(),
    role: z.nativeEnum(UserRole),
    createdAt: z.date(),
    updatedAt: z.date(),
});
