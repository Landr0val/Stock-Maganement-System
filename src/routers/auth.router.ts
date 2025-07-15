import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Container } from "../config/container";
import { z, ZodError } from "zod";
import { authenticateToken } from "../middlewares/auth.middleware";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
});

export async function authRouter(fastify: FastifyInstance) {
    const authService = Container.getAuthService();

    await fastify.register(
        async function (fastify) {
            fastify.post(
                "/login",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { email, password } = LoginSchema.parse(request.body);
                    try {
                        const result = await authService.login(email, password);
                        reply.status(200).send({
                            message: "Login successful",
                            ...result,
                        });
                    } catch (error) {
                        request.log.error(error, "Error during login attempt");
                        if (error instanceof ZodError) {
                            reply.status(400).send({
                                error: "Validation failed",
                                details: error.errors,
                            });
                        } else if (error instanceof Error) {
                            if (error.message.includes("Invalid credentials")) {
                                reply.status(401).send({
                                    error: "Invalid credentials",
                                });
                            } else {
                                reply.status(500).send({
                                    error: "Internal server error",
                                });
                            }
                        }
                    }
                },
            );

            fastify.patch(
                "/change-password",
                {
                    preHandler: [authenticateToken],
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    try {
                        const { currentPassword, newPassword } =
                            ChangePasswordSchema.parse(request.body);

                        if (!request.user) {
                            reply
                                .status(401)
                                .send({ error: "Authentication required" });
                            return;
                        }

                        await authService.changePassword(
                            request.user.id,
                            currentPassword,
                            newPassword,
                        );

                        reply.status(200).send({
                            message: "Password changed successfully",
                        });
                    } catch (error) {
                        if (error instanceof ZodError) {
                            reply.status(400).send({
                                error: "Validation failed",
                                details: error.errors,
                            });
                        } else if (error instanceof Error) {
                            if (error.message.includes("not found")) {
                                reply
                                    .status(404)
                                    .send({ error: error.message });
                            } else if (error.message.includes("incorrect")) {
                                reply
                                    .status(400)
                                    .send({ error: error.message });
                            } else {
                                reply
                                    .status(500)
                                    .send({ error: error.message });
                            }
                        } else {
                            reply.status(500).send({
                                error: "Internal server error",
                            });
                        }
                    }
                },
            );

            fastify.get(
                "/me",
                {
                    preHandler: [authenticateToken],
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    if (!request.user) {
                        reply
                            .status(401)
                            .send({ error: "Authentication required" });
                        return;
                    }

                    reply.status(200).send({
                        user: request.user,
                    });
                },
            );
        },
        { prefix: "/auth" },
    );
}
