import { CreateProductSchema, UpdateProductSchema, ProductResponseSchema } from "../schemas/product.schema";
import { z } from "zod";

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
