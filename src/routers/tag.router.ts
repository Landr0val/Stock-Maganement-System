import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { CreateTagSchema, UpdateTagSchema, TagResponseSchema } from "../schemas/tag.schema";
import { Container } from "../config/container";
import { UserRole } from '../utils/roles';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

export async function tagRouter(fastify: FastifyInstance) {
    const tagController = Container.getTagController();

    await fastify.register(
        async (fastify) => {
            fastify.post(
                "/",
                {
                    preHandler: [authenticateToken, authorizeRoles(UserRole.ADMIN)]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const data = CreateTagSchema.parse(request.body);
                    await tagController.createTag(data, request, reply);
                }
            )

            fastify.get(
                "/",
                {
                    preHandler: [authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    await tagController.findAllTags(request, reply)
                }
            )

            fastify.get(
                "/:id",
                {
                    preHandler: [authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await tagController.findTagById(id, request, reply);
                }
            )

            fastify.patch(
                "/:id",
                {
                    preHandler: [authenticateToken, authorizeRoles(UserRole.ADMIN)]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    const data = UpdateTagSchema.parse(request.body);
                    await tagController.updateTag(id, data, request, reply);
                }
            )

            fastify.delete(
                "/:id",
                {
                    preHandler: [authenticateToken, authorizeRoles(UserRole.ADMIN)]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await tagController.deleteTag(id, request, reply);
                }
            )
        }, { prefix: "/tags" }
    )
}
