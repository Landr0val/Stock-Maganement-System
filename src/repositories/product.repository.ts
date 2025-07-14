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
        return product[0];
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
        try {
            const offset = (options.page - 1) * options.limit;

            let whereClauses: string[] = [];
            let params: any[] = [];
            let paramIndex = 1;

            if (options.filters?.category) {
                whereClauses.push(`p.category_id = $${paramIndex}`);
                params.push(options.filters.category);
                paramIndex++;
            }
            if (options.filters?.tag) {
                whereClauses.push(`p.tags_id @> ARRAY[$${paramIndex}]::text[]`);
                params.push(options.filters.tag);
                paramIndex++;
            }

            const whereClause =
                whereClauses.length > 0
                    ? `WHERE ${whereClauses.join(" AND ")}`
                    : "";

            const query = `
                   WITH filtered_products AS (
                       SELECT
                           p.id,
                           p.name,
                           p.description,
                           p.stock,
                           p.price,
                           p.category_id,
                           ARRAY(
                               SELECT t.name
                               FROM tags t
                               WHERE t.id = ANY(p.tags_id)
                           ) AS tags_id,
                           p.created_at,
                           p.updated_at,
                           COUNT(*) OVER() AS total_count
                       FROM products p
                       ${whereClause}
                       ORDER BY p.created_at DESC
                       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
                   )
                   SELECT * FROM filtered_products
               `;

            const queryParams = [...params, options.limit, offset];
            const result = await this.db.query(query, queryParams);

            if (result.length === 0) {
                return { products: [], total: 0, totalPages: 0 };
            }

            const total = parseInt(result[0].total_count);
            const products = result.map((row: any) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                stock: Number(row.stock),
                price: BigInt(row.price),
                category_id: row.category_id,
                tags: row.tags_id,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
            }));

            const totalPages = Math.ceil(total / options.limit);

            return { products, total, totalPages };
        } catch (error) {
            console.error("Error in findAll:", error);
            throw error;
        }
    }

    async findById(id: string): Promise<ProductResponse | null> {
        const product = await this.db.query(
            "SELECT id, name, description, stock, price, category_id, tags_id, created_at, updated_at FROM public.products WHERE id = $1",
            [id],
        );

        return product[0];
    }

    async findByName(name: string): Promise<ProductResponse | null> {
        const product = await this.db.query(
            `SELECT name FROM public.products WHERE name = $1`,
            [name],
        );
        return product.length > 0 ? product[0] : null;
    }

    async update(
        id: string,
        data: UpdateProductInput,
    ): Promise<ProductResponse | null> {
        const filtered = Object.entries(data).filter(
            ([_, value]) => value != null,
        );
        const fieldsToUpdate = filtered.map(([key, _]) => key);
        const valuesToUpdate = filtered.map(([_, value]) => value);

        const setClause = fieldsToUpdate
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const query = `UPDATE public.products SET ${setClause} WHERE id = $1 RETURNING id, name, description, created_at, updated_at`;

        const product = await this.db.query(query, [id, ...valuesToUpdate]);

        return product[0];
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db.query(
            "DELETE FROM public.products WHERE id = $1 RETURNING id",
            [id],
        );

        return result.length > 0;
    }
}
