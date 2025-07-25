import { z } from "zod";

export const CreateProductSchema = z.object({
   name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
   description: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters").optional(),
   stock: z.number().int().min(0, "Stock must be a non-negative integer"),
   price: z.coerce.number(),
   category_id: z.string().ulid("Invalid category ID format"),
   image: z.string().url("Invalid image URL format").optional(),
   tags_id: z.array(z.string().ulid()).optional()
});

export const UpdateProductSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
    description: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters").optional(),
    stock: z.number().int().min(0, "Stock must be a non-negative integer").optional(),
    price: z.coerce.number().optional(),
    category_id: z.string().ulid("Invalid category ID format").optional(),
    image: z.string().url("Invalid image URL format").optional(),
    tags_id: z.array(z.string().ulid()).optional()
});

export const ProductResponseSchema = z.object({
    id: z.string().ulid("Invalid product ID format"),
    name: z.string(),
    description: z.string().optional(),
    stock: z.number().int(),
    price: z.coerce.number(),
    category_id: z.string().ulid("Invalid category ID format"),
    image: z.string().url("Invalid image URL format").optional(),
    tags_id: z.array(z.string().ulid()).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
