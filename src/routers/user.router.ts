import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema";
import { Container } from "../config/container";
import { ZodError } from "zod";

export async function userRouter(fastify: FastifyInstance) {
    const userController = Container.getUserController();

    await fastify.register(
        async (fastify: FastifyInstance) => {
            fastify.post(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const data = CreateUserSchema.parse(request.body);
                    try {
                        const user = await userController.createUser(data);
                        reply.status(201).send(user);
                    } catch (error) {
                        if (error instanceof ZodError) {
                            reply.status(400).send({
                                message: "Validation error",
                                errors: error.errors,
                            });
                        } else {
                            reply.status(500).send({
                                message: "Internal server error",
                            });
                        }
                    }
                }
            );

            fastify.get(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { page = 1, limit = 10, role } = request.query as {
                        page?: number;
                        limit?: number;
                        role?: string;
                    };
                    try {
                        const filter: { role?: string } = {};
                        if (role) filter.role = role;

                        const users = await userController.findAllUsers({
                            page,
                            limit,
                            filter: Object.keys(filter).length > 0 ? filter : undefined,
                        });
                        reply.status(200).send(users);
                    } catch (error) {
                        reply.status(500).send({
                            message: "Internal server error",
                        });
                    }
                }
            );

            fastify.get(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    try {
                        const user = await userController.findUserById(id);
                        if (!user) {
                            return reply.status(404).send({
                                message: `User with id ${id} not found`,
                            });
                        }
                        reply.status(200).send(user);
                    } catch (error) {
                        reply.status(500).send({
                            message: "Internal server error",
                        });
                    }
                }
            );

            fastify.patch(
                "/:id",
                async (request: FastifyRequest,
                    reply: FastifyReply
                ) => {
                    const { id } = request.params as { id: string };
                    const data = UpdateUserSchema.parse(request.body);
                    try {
                        const user = await userController.updateUser(id, data);
                        if (!user) {
                            return reply.status(404).send({
                                message: `User with id ${id} not found`,
                            });
                        }
                        reply.status(200).send(user);
                    } catch (error) {
                        if (error instanceof ZodError) {
                            reply.status(400).send({
                                message: "Validation error",
                                errors: error.errors,
                            });
                        } else {
                            reply.status(500).send({
                                message: "Internal server error",
                            });
                        }
                    }
                }
            )

            fastify.delete(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    try {
                        await userController.deleteUser(id);
                        reply.status(204).send();
                    } catch (error) {
                        request.log.error(error);
                        reply.status(500).send({
                            message: "Internal server error",
                        });
                    }
                }
            );
        }, { prefix: "/users" }
    );
}
