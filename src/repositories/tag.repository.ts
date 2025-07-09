import type {
    CreateTagInput,
    UpdateTagInput,
    TagResponse,
} from "../types/tag.type";
import { DatabaseService } from "../services/database.service";
import { ulid } from "ulid";

export class TagRepository {
    constructor(private readonly db: DatabaseService) {}

    async create(data: CreateTagInput): Promise<TagResponse> {
        const id = ulid();
        const tag = await this.db.query(
            "INSERT INTO public.tag (id, name, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, created_at, updated_at",
            [id, data.name, data.description, new Date(), new Date()],
        );
        return tag;
    }

    async findAll(): Promise<TagResponse[]> {
        const tags = this.db.query(
            `SELECT id, name, description, created_at, updated_at FROM public.tags`,
        );
        return tags;
    }

    async findById(id: string): Promise<TagResponse> {
        const tag = this.db.query(
            `SELECT id, name, description, created_at, updated_at FROM public.tags WHERE id = $1`,
            [id],
        );
        return tag;
    }

    async update(id: string, data: UpdateTagInput): Promise<TagResponse> {
        const filtered = Object.entries(data).filter(
            ([_, value]) => value != null,
        );
        const fieldsToUpdate = filtered.map(([key, _]) => key);
        const valuesToUpdate = filtered.map(([_, value]) => value);

        const setClause = fieldsToUpdate
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const query = `UPDATE public.categories SET ${setClause}, updated_at = $${fieldsToUpdate.length + 2} WHERE id = $1 RETURNING id, name, description, parend_id, created_at, updated_at`;

        const tag = await this.db.query(query, [
            id,
            ...valuesToUpdate,
            new Date(),
        ]);

        if (!tag) {
            throw new Error(`Tag with id ${id} not found`);
        }

        return tag.rows[0];
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await this.db.query(
            "DELETE FROM public.tags WHERE id = $1",
            [id]
        );
        if (!deleted) {
            throw new Error(`Category id ${id} not f ound`);
        }
        return deleted > 0;
    }
}
