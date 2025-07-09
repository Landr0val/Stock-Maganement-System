import { CreateTagSchema, UpdateTagSchema, TagResponseSchema } from "../schemas/tag.schema";
import { z } from "zod";

export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
export type TagResponse = z.infer<typeof TagResponseSchema>;
