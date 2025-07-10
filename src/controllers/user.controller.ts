import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateUserInput, UpdateUserInput, UserResponse } from "../types/user.type";
import { UserService } from "../services/user.service";
import { ZodError } from "zod";

export class UserController {
    constructor(private readonly service: UserService) {}

    async createUser(data: CreateUserInput, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const user = await this.service.createUser(data);
            reply.status(201).send(user);
        } catch (error) {
            request.log.error(error);
            if (error instanceof ZodError){
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

    async updateUser(id: string, data: UpdateUserInput, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const updatedUser = await this.service.updateUser(id, data);
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
