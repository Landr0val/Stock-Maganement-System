import type { FastifyRequest, FastifyReply } from "fastify";
import { JWTService } from "../services/jwt.service";

declare module "fastify" {
    interface FastifyRequest {
        user?: {
            id: string;
            email: string;
            role: string;
        };
    }
}

export const authenticateToken = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        const authHeader = request.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return reply.status(401).send({
                error: "Access token required",
            });
        }

        const payload = JWTService.verifyToken(token);
        request.user = payload;
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(401).send({
                error: error.message,
            });
        } else {
            return reply.status(401).send({
                error: "Invalid token",
            });
        }
    }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user) {
            return reply.status(401).send({
                error: "Authentication required",
            });
        }

        if (!allowedRoles.includes(request.user.role)) {
            return reply.status(403).send({
                error: "Insufficient permissions",
            });
        }
    };
};
