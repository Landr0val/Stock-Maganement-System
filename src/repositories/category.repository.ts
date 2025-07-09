import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryResponse,
} from "../types/category.type";
import { DatabaseService } from "../services/database.service";
import { ulid } from "ulid";

export class CategoryRepository {
    constructor(private readonly db: DatabaseService) {}

    async create(data: CreateCategoryInput): Promise<CategoryResponse> {
        const id = ulid();
        const query = data.parentId
            ? `INSERT INTO public.categories (id, name, description, parent_id) VALUES ($1, $2, $3, $4) RETURNING id, name, description, parent_id, created_at, updated_at`
            : `INSERT INTO public.categories (id, name, description) VALUES ($1, $2, $3) RETURNING id, name, description, created_at, updated_at`;
        const values = data.parentId
            ? [
                  id,
                  data.name,
                  data.description,
                  data.parentId
              ]
            : [id, data.name, data.description];
        const category = await this.db.query(query, values);
        return category[0];
    }

    async findAll(): Promise<CategoryResponse[]> {
        const categories = await this.db.query(
            "SELECT id, name, description, parent_id, created_at, updated_at FROM public.categories",
        );
        return categories;
    }

    async findById(id: string): Promise<CategoryResponse | null> {
        const category = await this.db.query(
            "SELECT name, description, parent_id, created_at, updated_at FROM public.categories WHERE id = $1",
            [id],
        );
        if (!category || category.length === 0) {
            throw new Error(`Category with id ${id} not found`);
        }
        return category;
    }

    async update(
        id: string,
        data: UpdateCategoryInput,
    ): Promise<CategoryResponse> {
        const filtered = Object.entries(data).filter(
            ([_, value]) => value != null,
        );
        const fieldsToUpdate = filtered.map(([key, _]) => key);
        const valuesToUpdate = filtered.map(([_, value]) => value);

        const setClause = fieldsToUpdate
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const query = `UPDATE public.categories SET ${setClause}, updated_at = $${fieldsToUpdate.length + 2} WHERE id = $1 RETURNING id, name, description, parent_id, created_at, updated_at`;

        const category = await this.db.query(query, [
            id,
            ...valuesToUpdate,
            new Date(),
        ]);

        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }

        return category[0];
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await this.db.query(
            `DELETE FROM public.categories WHERE id = $1`,
            [id],
        );
        return deleted > 0;
    }
}
