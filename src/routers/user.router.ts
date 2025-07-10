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
                    await userController.createUser(data, request, reply);
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

                    const filter: { role?: string } = {};
                    if (role) filter.role = role;

                    await userController.findAllUsers({
                        page,
                        limit,
                        filter: Object.keys(filter).length > 0 ? filter : undefined,
                    }, request, reply);
                }
            );

            fastify.get(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await userController.findUserById(id, request, reply);
                }
            );

            fastify.patch(
                "/:id",
                async (request: FastifyRequest,
                    reply: FastifyReply
                ) => {
                    const { id } = request.params as { id: string };
                    const data = UpdateUserSchema.parse(request.body);
                    await userController.updateUser(id, data, request, reply);
                }
            )

            fastify.delete(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await userController.deleteUser(id, request, reply);
                }
            );
        }, { prefix: "/users" }
    );
}
