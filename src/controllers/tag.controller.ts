import type {
    CreateTagInput,
    UpdateTagInput,
    TagResponse,
} from "../types/tag.type";
import type { FastifyReply, FastifyRequest } from "fastify";
import { TagService } from "../services/tag.service";
import { ZodError } from "zod";

export class TagController {
    constructor(private readonly service: TagService) {}

    async createTag(data: CreateTagInput, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const tag = await this.service.createTag(data);
            reply.status(201).send(tag);
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

    async findAllTags(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const tags = await this.service.findAllTags();
            reply.status(200).send(tags);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("No tags found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async findTagById(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const tag = await this.service.findTagById(id);
            reply.status(200).send(tag);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("not found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async updateTag(id: string, data: UpdateTagInput, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const tag = await this.service.updateTag(id, data);
            reply.status(200).send(tag);
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

    async deleteTag(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await this.service.deleteTag(id);
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
