import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { CreateCategorySchema, UpdateCategorySchema, CategoryResponseSchema } from "../schemas/category.schema";
import { Container } from "../config/container";
import { ZodError } from "zod";

export async function categoryRoutes(fastify: FastifyInstance) {
    const categoryController = Container.getCategoryController();

    await fastify.register(
        async (fastify) => {
            fastify.post(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    try {
                        const data = CreateCategorySchema.parse(request.body);
                        const category = await categoryController.createCategory(data);
                        reply.status(201).send(category);
                    } catch (error) {
                        if (error instanceof ZodError) {
                            reply.status(400).send({ error: error.errors });
                        } else {
                            reply.status(500).send({ error: "Internal Server Error" });
                        }
                    }
                }
            )

            fastify.get(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    try {
                        const categories = await categoryController.findAllCategories();
                        reply.send(categories);
                    } catch (error) {
                        reply.status(500).send({ error: "Internal Server Error" });
                    }
                }
            )

            fastify.get(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    try {
                        const { id } = request.params as { id: string };
                        const category = await categoryController.findCategoryById(id);
                        if (!category) {
                            reply.status(404).send({ error: "Category not found" });
                        } else {
                            reply.send(category);
                        }
                    } catch (error) {
                        reply.status(500).send({ error: "Internal Server Error" });
                    }
                }
            )

            fastify.patch(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    try {
                        const data = UpdateCategorySchema.parse(request.body);
                        const updatedCategory = await categoryController.updateCategory(id, data);
                        if (!updatedCategory) {
                            reply.status(404).send({ error: "Category not found" });
                        } else {
                            reply.send(updatedCategory);
                        }
                    } catch (error) {
                        if (error instanceof ZodError) {
                            reply.status(400).send({ error: error.errors });
                        } else {
                            reply.status(500).send({ error: "Internal Server Error" });
                        }
                    }
                }
            )

            fastify.delete(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    try {
                        const deleted = await categoryController.deleteCategory(id);
                        if (!deleted) {
                            reply.status(404).send({ error: "Category not found" });
                        } else {
                            reply.status(204).send();
                        }
                    } catch (error) {
                        reply.status(500).send({ error: "Internal Server Error" });
                    }
                }
            )
        }, { prefix: "/categories" }
    )
}
