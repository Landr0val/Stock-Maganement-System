import type {
    CreateProductInput,
    UpdateProductInput,
    ProductResponse,
} from "../types/product.type";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(private readonly service: ProductService) {}

    async createProduct(input: CreateProductInput): Promise<ProductResponse> {
        return this.service.createProduct(input);
    }

    async findAllProducts(options: {
        page: number;
        limit: number;
        filter?: { category?: string; tag?: string };
    }): Promise<{
        products: ProductResponse[];
        total: number;
        totalPages: number;
    }> {
        return await this.service.findAllProducts(options);
    }

    async findProductById(id: string): Promise<ProductResponse | null> {
        return await this.service.findProductById(id);
    }

    async updateProduct(
        id: string,
        input: UpdateProductInput,
    ): Promise<ProductResponse | null> {
        return await this.service.updateProduct(id, input);
    }

    async deleteProduct(id: string): Promise<boolean> {
        return await this.service.deleteProduct(id);
    }
}
