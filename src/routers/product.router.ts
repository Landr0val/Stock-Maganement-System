import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateProductSchema, UpdateProductSchema } from '../schemas/product.schema';
import { Container } from '../config/container';
import { UserRole } from '../utils/roles';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

export async function productRouter(fastify: FastifyInstance) {
    const productController = Container.getProductController();

    await fastify.register(
        async (fastify: FastifyInstance) => {
            fastify.post(
                "/",
                {
                    preHandler: [
                        authenticateToken,
                        authorizeRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
                    ]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const data = CreateProductSchema.parse(request.body);
                    await productController.createProduct(data, request, reply);
                }
            )

            fastify.get(
                "/",
                {
                    preHandler: [
                        authenticateToken,
                        authorizeRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
                    ]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                        const { page = 1, limit = 10, category, tag } = request.query as {
                            page?: number;
                            limit?: number;
                            category?: string;
                            tag?: string;
                        };
                        const filter: { category?: string; tag?: string } = {};
                        if (category) filter.category = category;
                        if (tag) filter.tag = tag;

                        await productController.findAllProducts({
                            page: Number(page),
                            limit: Number(limit),
                            filter: Object.keys(filter).length > 0 ? filter : undefined,
                        }, request, reply);
                    }
            )

            fastify.get(
                "/:id",
                {
                    preHandler: [
                        authenticateToken,
                        authorizeRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
                    ]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    await productController.findProductById(id, request, reply);
                }
            )

            fastify.patch(
                "/:id",
                {
                    preHandler: [
                        authenticateToken,
                        authorizeRoles(UserRole.ADMIN, UserRole.MANAGER)
                    ]
                },
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    const data = UpdateProductSchema.parse(request.body);
                    await productController.updateProduct(id, data, request, reply)
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
                    await productController.deleteProduct(id, request, reply);
                }
            )
        }, { prefix: '/products' }
    )
}
