import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateUserInput, UpdateUserInput, UserResponse } from "../types/user.type";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema";
import { UserService } from "../services/user.service";
import { ZodError } from "zod";
import { UserRole } from "../utils/roles";

export class UserController {
    constructor(private readonly service: UserService) {}

    async createUser(data: CreateUserInput, request: FastifyRequest, reply: FastifyReply): Promise<void> {
            try {
                const validatedData = CreateUserSchema.parse(data);
                const roleToCreate = data.role;
                const requesterRole = request.user?.role;
                if (roleToCreate === UserRole.ADMIN || roleToCreate === UserRole.MANAGER) {
                    if (requesterRole !== UserRole.ADMIN) {
                        return reply.status(403).send({
                            error: "Insufficient permissions"
                        });
                    }
                }

                if (validatedData.phone_number < 1000000000) {
                    return reply.status(422).send({
                        error: "Phone number must be at least 10 digits"
                    });
                }

                const user = await this.service.createUser(validatedData);
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
            }
        }

    async findAllUsers(options: {
        page: number;
        limit: number;
        filter?: { role?: string; };
    }, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const users = await this.service.findAllUsers(options);
            reply.status(200).send(users);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("No users found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async findUserById(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const user = await this.service.findUserById(id);
            reply.status(200).send(user);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("not found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async updateUser(id: string, data: any, request: FastifyRequest, reply: FastifyReply): Promise<void> {
            try {
                const validatedData = UpdateUserSchema.parse(data);

                if (validatedData.phone_number && validatedData.phone_number < 1000000000) {
                    return reply.status(422).send({
                        error: "Phone number must be at least 10 digits"
                    });
                }

                const updatedUser = await this.service.updateUser(id, validatedData);
                reply.status(200).send(updatedUser);
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

    async deleteUser(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await this.service.deleteUser(id);
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
