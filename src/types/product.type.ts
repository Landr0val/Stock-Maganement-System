import { CreateCategorySchema, UpdateCategorySchema, CategoryResponseSchema } from "../schemas/category.schema";
import { z } from "zod";

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
