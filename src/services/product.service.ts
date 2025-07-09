import type { CreateProductInput, UpdateProductInput, ProductResponse } from "../types/product.type";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
    constructor(private readonly repository: ProductRepository) {}

    async createProduct(data: CreateProductInput): Promise<ProductResponse> {
        const product = await this.repository.create(data);
        return product;
    }

    async findAllProducts(options: {
        page: number;
        limit: number;
        filters?: { category?: string; tag?: string }
    }): Promise<{
        products: ProductResponse[];
        total: number;
        totalPages: number;
    }> {
        const products = await this.repository.findAll(options);
        return products;
    }

    async findProductById(id: string): Promise<ProductResponse | null> {
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        return product;
    }

    async updateProduct(id: string, data: UpdateProductInput): Promise<ProductResponse> {
        const updatedProduct = await this.repository.update(id, data);
        if (!updatedProduct) {
            throw new Error(`Product with id ${id} not found`);
        }
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<void> {
        const deleted = await this.repository.delete(id);
        if (!deleted) {
            throw new Error(`Product with id ${id} not found`);
        }
    }
}
