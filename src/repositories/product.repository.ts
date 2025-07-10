import type {
    CreateProductInput,
    UpdateProductInput,
    ProductResponse,
} from "../types/product.type";
import { DatabaseService } from "../services/database.service";
import { ulid } from "ulid";

export class ProductRepository {
    constructor(private readonly db: DatabaseService) {}

    async create(data: CreateProductInput): Promise<ProductResponse> {
        const id = ulid();
        const filtered = Object.entries(data).filter(
            ([_, value]) => value != null,
        );
        const fieldsToInsert = ["id", ...filtered.map(([key, _]) => key)];
        const valuesToInsert = [id, ...filtered.map(([_, value]) => value)];

        const query = `INSERT INTO public.products (${fieldsToInsert.join(", ")}) VALUES (${fieldsToInsert.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING id, name, description, price, created_at, updated_at`;
        const product = await this.db.query(query, valuesToInsert);
        return product.rows[0];
    }

    async findAll(options: {
        page: number;
        limit: number;
        filters?: { category?: string; tag?: string };
    }): Promise<{
        products: ProductResponse[];
        total: number;
        totalPages: number;
    }> {
        const offset = (options.page - 1) * options.limit;

        const whereClauses: string[] = [];
        const params: any[] = [];
        const paramIndex = 1;

        if (options.filters?.category) {
            whereClauses.push(`category_id = $${paramIndex}`);
            params.push(options.filters.category);
        }
        if (options.filters?.tag) {
            whereClauses.push(`tags @> ARRAY[$${paramIndex + params.length}]`);
            params.push(options.filters.tag);
        }

        const whereClause =
            whereClauses.length > 0
                ? `WHERE ${whereClauses.join(" AND ")}`
                : "";
        const query = `SELECT id, name, description, price, created_at, updated_at FROM public.products ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex + params.length} OFFSET $${paramIndex + params.length + 1}`;
        params.push(options.limit, offset);
        const result = await this.db.query(query, params);
        const products = result.map((row: any) => {
            const { total_count, ...products } = row;
        });
        const total = result.length > 0 ? parseInt(result[0].total_count) : 0;
        const totalPages = Math.ceil(total / options.limit);
        return {
            products,
            total,
            totalPages,
        };
    }

    async findById(id: string): Promise<ProductResponse | null> {
        const product = await this.db.query(
            "SELECT id, name, description, stock, price, category_id, tags_id, created_at, updated_at FROM public.products WHERE id = $1",
            [id],
        );
        if (!product && product.length === 0) {
            return null;
        }
        return product[0];
    }

    async update(
        id: string,
        data: UpdateProductInput,
    ): Promise<ProductResponse | null> {
        const filtered = Object.entries(data).filter(
            ([_, value]) => value != null,
        );
        if (filtered.length === 0) {
            return null;
        }
        const fieldsToUpdate = filtered.map(
            ([key, _], index) => `${key} = $${index + 1}`,
        );
        const valuesToUpdate = filtered.map(([_, value]) => value);
        valuesToUpdate.push(id);

        const query = `UPDATE public.products SET ${fieldsToUpdate.join(", ")} WHERE id = $${valuesToUpdate.length} RETURNING id, name, description, stock, price, category_id, tags_id, created_at, updated_at`;
        const result = await this.db.query(query, valuesToUpdate);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db.query(
            "DELETE FROM public.products WHERE id = $1 RETURNING id",
            [id],
        );
        return result.rows.length > 0;
    }
}
