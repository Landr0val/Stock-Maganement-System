import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { CreateTagSchema, UpdateTagSchema, TagResponseSchema } from "../schemas/tag.schema";
import { Container } from "../config/container";
import { ZodError } from "zod";

export async function tagRoutes(fastify: FastifyInstance) {
    const tagController = Container.getTagController();

    await fastify.register(
        async (fastify) => {
            fastify.post(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    try {
                        const data = CreateTagSchema.parse(request.body);
                        const tag = await tagController.createTag(data);
                        reply.status(201).send(tag);
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
                        const tags = await tagController.findAllTags();
                        reply.send(tags);
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
                        const tag = await tagController.findTagById(id);
                        if (!tag) {
                            reply.status(404).send({ error: "Tag not found" });
                        } else {
                            reply.send(tag);
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
                        const data = UpdateTagSchema.parse(request.body);
                        const updatedTag = await tagController.updateTag(id, data);
                        if (!updatedTag) {
                            reply.status(404).send({ error: "Tag not found" });
                        } else {
                            reply.send(updatedTag);
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
                        const deletedTag = await tagController.deleteTag(id);
                        if (!deletedTag) {
                            reply.status(404).send({ error: "Tag not found" });
                        } else {
                            reply.status(204).send();
                        }
                    } catch (error) {
                        reply.status(500).send({ error: "Internal Server Error" });
                    }
                }
            )
        }
    )
}
