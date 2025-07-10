import type {
    CreateProductInput,
    UpdateProductInput,
    ProductResponse,
} from "../types/product.type";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(private readonly service: ProductService) {}

    async createProduct(data: CreateProductInput, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const product = await this.service.createProduct(data);
            reply.status(201).send(product);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("already exists")) {
                reply.status(409).send({ error: error.message });
            } else if (error instanceof Error && error.message.includes("Validation error")) {
                reply.status(400).send({ error: "Validation error" });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async findAllProducts(options: {
        page: number;
        limit: number;
        filter?: { category?: string; tag?: string };
    }, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const products = await this.service.findAllProducts(options);
            reply.status(200).send(products);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("No products found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async findProductById(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const product = await this.service.findProductById(id);
            reply.status(200).send(product);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("not found")) {
                reply.status(404).send({ error: error.message });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async updateProduct(
        id: string,
        data: UpdateProductInput,
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const product = await this.service.updateProduct(id, data);
            reply.status(200).send(product);
        } catch (error) {
            request.log.error(error);
            if (error instanceof Error && error.message.includes("not found")) {
                reply.status(404).send({ error: error.message });
            } else if (error instanceof Error && error.message.includes("Validation error")) {
                reply.status(400).send({ error: "Validation error" });
            } else {
                reply.status(500).send({ error: "Internal Server Error" });
            }
        }
    }

    async deleteProduct(id: string, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await this.service.deleteProduct(id);
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
