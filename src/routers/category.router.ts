import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { CreateCategorySchema, UpdateCategorySchema, CategoryResponseSchema } from "../schemas/category.schema";
import { Container } from "../config/container";
import { ZodError } from "zod";

export async function categoryRouter(fastify: FastifyInstance) {
    const categoryController = Container.getCategoryController();

    await fastify.register(
        async (fastify) => {
            fastify.post(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const data = CreateCategorySchema.parse(request.body);
                    await categoryController.createCategory(data, request, reply);

                }
            )

            fastify.get(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    await categoryController.findAllCategories(request, reply);
                }
            )

            fastify.get(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await categoryController.findCategoryById(id, request, reply);
                }
            )

            fastify.patch(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };

                    const data = UpdateCategorySchema.parse(request.body);
                    await categoryController.updateCategory(id, data, request, reply);
                }
            )

            fastify.delete(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await categoryController.deleteCategory(id, request, reply);
                }
            )
        }, { prefix: "/categories" }
    )
}
