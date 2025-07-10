import type { CreateProductInput, UpdateProductInput, ProductResponse } from "../types/product.type";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
    constructor(private readonly repository: ProductRepository) {}

    async createProduct(data: CreateProductInput): Promise<ProductResponse> {
        const existingProduct = await this.repository.findByName(data.name);
        if (existingProduct) {
            throw new Error(`Product with name ${data.name} already exists`);
        }
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
        if (!products || products.products.length === 0) {
            throw new Error("No products found");
        }
        return products;
    }

    async findProductById(id: string): Promise<ProductResponse | null> {
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error(`Product not found`);
        }
        return product;
    }

    async updateProduct(id: string, data: UpdateProductInput): Promise<ProductResponse> {
        const updatedProduct = await this.repository.update(id, data);
        if (!updatedProduct) {
            throw new Error(`Product not found`);
        }
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<boolean> {
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error(`Product not found`);
        }
        const deleted = await this.repository.delete(id);
        return deleted;
    }
}
