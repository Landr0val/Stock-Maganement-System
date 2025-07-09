import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryResponse,
} from "../types/category.type";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    constructor(private readonly service: CategoryService) {}

    async createCategory(data: CreateCategoryInput): Promise<CategoryResponse> {
        return this.service.createCategory(data);
    }

    async findCategoryById(id: string): Promise<CategoryResponse | null> {
        return this.service.findCategoryById(id);
    }

    async findAllCategories(): Promise<CategoryResponse[]> {
        return this.service.findAllCategories();
    }

    async updateCategory(
        id: string,
        data: UpdateCategoryInput,
    ): Promise<CategoryResponse> {
        return this.service.updateCategory(id, data);
    }

    async deleteCategory(id: string): Promise<boolean> {
        return this.service.deleteCategory(id);
    }
}
