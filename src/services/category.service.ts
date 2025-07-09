import type { CreateCategoryInput, UpdateCategoryInput, CategoryResponse } from "../types/category.type";
import { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {
    constructor(private readonly repository: CategoryRepository) { }

    async createCategory(data: CreateCategoryInput): Promise<CategoryResponse> {
        const category = await this.repository.create(data);
        return category;
    }

    async findAllCategories(): Promise<CategoryResponse[]> {
        const categories = await this.repository.findAll();
        if (!categories || categories.length === 0) {
            throw new Error("No categories found");
        }
        return categories;
    }

    async findCategoryById(id: string): Promise<CategoryResponse | null> {
        const category = await this.repository.findById(id);
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return category;
    }

    async updateCategory(
        id: string,
        data: UpdateCategoryInput,
    ): Promise<CategoryResponse> {
        const category = await this.repository.update(id, data);
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return category;
    }

    async deleteCategory(id: string): Promise<boolean> {
        const category = await this.repository.findById(id);
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return await this.repository.delete(id);
    }
}
