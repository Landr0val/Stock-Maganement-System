import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema";
import { Container } from "../config/container";
import { ZodError } from "zod";
import { UserRole } from "../utils/roles";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware";

export async function userRouter(fastify: FastifyInstance) {
    const userController = Container.getUserController();

    await fastify.register(
        async (fastify: FastifyInstance) => {
            fastify.post(
                "/",
                {
                    preHandler: [
                        authenticateToken,
                    ]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const validatedBody = CreateUserSchema.parse(request.body);
                    await userController.createUser(validatedBody, request, reply);
                }
            );

            fastify.get(
                "/",
                {
                    preHandler: [
                        authenticateToken,
                        authorizeRoles(UserRole.ADMIN, UserRole.MANAGER)
                    ]
                },
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
                {
                    preHandler: [
                        authenticateToken,
                        authorizeRoles(UserRole.ADMIN, UserRole.MANAGER)
                    ]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await userController.findUserById(id, request, reply);
                }
            );

            fastify.patch(
                "/:id",
                {
                    preHandler: [authenticateToken]
                },
                async (request: FastifyRequest,
                    reply: FastifyReply
                ) => {
                    const { id } = request.params as { id: string };
                    await userController.updateUser(id, request.body, request, reply);
                }
            )

            fastify.delete(
                "/:id",
                {
                    preHandler: [
                        authenticateToken,
                        authorizeRoles(UserRole.ADMIN, UserRole.MANAGER)
                    ]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await userController.deleteUser(id, request, reply);
                }
            );
        }, { prefix: "/users" }
    );
}
