import { z } from "zod";

export const CreateCategorySchema = z.object({
   name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
   description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters").optional(),
   parentId: z.string().ulid("Invalid parent ID format").optional(),
});

export const UpdateCategorySchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
    description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters").optional(),
    parentId: z.string().ulid("Invalid parent ID format").optional(),
})

export const CategoryResponseSchema = z.object({
    id: z.string().ulid("Invalid category ID format"),
    name: z.string(),
    description: z.string().optional(),
    parentId: z.string().ulid("Invalid parent ID format").optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
