import { z } from "zod";

export const CreateTagSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters long"),
    description: z.string().max(200, "Description must be at most 200 characters long").optional(),
    color: z.string().max(20, "Color must be at most 20 characters long"),
});

export const UpdateTagSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters long").optional(),
    description: z.string().max(200, "Description must be at most 200 characters long").optional(),
    color: z.string().max(20, "Color must be at most 20 characters long").optional(),
});

export const TagResponseSchema = z.object({
    id: z.string().uuid("Invalid tag ID format"),
    name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters long"),
    description: z.string().max(200, "Description must be at most 200 characters long").optional(),
    color: z.string().max(20, "Color must be at most 20 characters long"),
});
