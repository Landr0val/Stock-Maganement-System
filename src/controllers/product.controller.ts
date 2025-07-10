import type {
    CreateProductInput,
    UpdateProductInput,
    ProductResponse,
} from "../types/product.type";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(private readonly service: ProductService) {}

    async createProduct(data: CreateProductInput): Promise<ProductResponse> {
        return this.service.createProduct(data);
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
        data: UpdateProductInput,
    ): Promise<ProductResponse | null> {
        return await this.service.updateProduct(id, data);
    }

    async deleteProduct(id: string): Promise<boolean> {
        return await this.service.deleteProduct(id);
    }
}
