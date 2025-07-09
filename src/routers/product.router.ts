import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateProductSchema } from '../schemas/product.schema';
import { Container } from '../config/container';
import { ZodError } from 'zod';

export async function productRoutes(fastify: FastifyInstance) {
    const productController = Container.getProductController();

    await fastify.register(
        async (fastify: FastifyInstance) => {
            fastify.post(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const data = CreateProductSchema.parse(request.body);
                    try {
                        const product = await productController.createProduct(data);
                        reply.status(201).send(product);
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

            fastify.get(
                "/",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { page = 1, limit = 10, category, tag } = request.query as {
                        page?: number;
                        limit?: number;
                        category?: string;
                        tag?: string;
                    };
                    try {
                        const filter: { category?: string; tag?: string } = {};
                        if (category) filter.category = category;
                        if (tag) filter.tag = tag;

                        const products = await productController.findAllProducts({
                            page,
                            limit,
                            filter: Object.keys(filter).length > 0 ? filter : undefined
                        });
                        reply.status(200).send(products);
                    } catch (error) {
                        reply.status(500).send({
                            message: "Internal server error",
                        });
                    }
                }
            )

            fastify.get(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    try {
                        const product = await productController.findProductById(id);
                        if (!product) {
                            reply.status(404).send({
                                message: "Product not found",
                            });
                        } else {
                            reply.status(200).send(product);
                        }
                    } catch (error) {
                        reply.status(500).send({
                            message: "Internal server error",
                        });
                    }
                }
            )

            fastify.patch(
                "/:id",
                async (request: FastifyRequest, reply: FastifyReply) => {
                    const { id } = request.params as { id: string };
                    const data = CreateProductSchema.partial().parse(request.body);
                    try {
                        const updatedProduct = await productController.updateProduct(id, data);
                        if (!updatedProduct) {
                            reply.status(404).send({
                                message: "Product not found",
                            });
                        } else {
                            reply.status(200).send(updatedProduct);
                        }
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
                        const deletedProduct = await productController.deleteProduct(id);
                        if (!deletedProduct) {
                            reply.status(404).send({
                                message: "Product not found",
                            });
                        } else {
                            reply.status(204).send();
                        }
                    } catch (error) {
                        reply.status(500).send({
                            message: "Internal server error",
                        });
                    }
                }
            )
        }, { prefix: '/products' }
    )
}
