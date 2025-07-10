import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryResponse,
} from "../types/category.type";
import { CategoryService } from "../services/category.service";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export class CategoryController {
    constructor(private readonly service: CategoryService) {}

    async createCategory(data: CreateCategoryInput, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const user = await this.service.createCategory(data);
            reply.status(201).send(user);
        } catch (error) {
            request.log.error(error);
            if (error instanceof ZodError) {
                reply.status(400).send({
                    message: "Validation error",
                    errors: error.errors,
                });
            } else if (error instanceof Error && error.message.includes("already exists")) {
                reply.status(409).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
            // throw error; <- Re-throw to allow further handling if needed
        }
    }

    async findAllCategories(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const categories = await this.service.findAllCategories();
            reply.status(200).send(categories);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("No categories found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async findCategoryById(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const category = await this.service.findCategoryById(id);
            reply.status(200).send(category);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("not found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async updateCategory(
        id: string,
        data: UpdateCategoryInput,
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const category = await this.service.updateCategory(id, data);
            reply.status(200).send(category);
        } catch (error) {
            request.log.error(error);
            if (error instanceof ZodError) {
                reply.status(400).send({
                    message: "Validation error",
                    errors: error.errors,
                });
            } else if (error instanceof Error && error.message.includes("not found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async deleteCategory(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await this.service.deleteCategory(id);
            reply.status(204).send();
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("not found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }
}
