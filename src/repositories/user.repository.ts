import type {
    CreateUserInput,
    UpdateUserInput,
    UserResponse,
} from "../types/user.type";
import { DatabaseService } from "../services/database.service";
import { ulid } from "ulid";

export class UserRepository {
    constructor(private readonly db: DatabaseService) {}

    async create(data: CreateUserInput): Promise<UserResponse> {
        const id = ulid();
        const user = await this.db.query(
            "INSERT INTO public.users (id, first_name, last_name, email, phone_number, role, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, email, phone_number, role, created_at, updated_at",
            [
                id,
                data.first_name,
                data.last_name,
                data.email,
                data.phone_number,
                data.role,
                data.password,
            ],
        );
        return user;
    }

    async findAll(options: {
        page: number;
        limit: number;
        filter?: { role?: string };
    }): Promise<{
        users: UserResponse[];
        total: number;
        totalPages: number;
    }> {
        const offset = (options.page - 1) * options.limit;

        const whereClauses: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        if (options.filter?.role) {
            whereClauses.push(`role = $${paramIndex}`);
            params.push(options.filter.role);
            paramIndex++;
        }

        const whereClause =
            whereClauses.length > 0
                ? `WHERE ${whereClauses.join(" AND ")}`
                : "";

        const usersQuery = `SELECT id, first_name, last_name, email, phone_number, role, created_at, updated_at FROM public.users ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(options.limit, offset);

        const countQuery = `SELECT COUNT(*) as total FROM public.users ${whereClause}`;
        const countParams = options.filter?.role ? [options.filter.role] : [];

        const [usersResult, countResult] = await Promise.all([
            this.db.query(usersQuery, params),
            this.db.query(countQuery, countParams),
        ]);

        const users = usersResult;
        const total = parseInt(countResult[0].total);
        const totalPages = Math.ceil(total / options.limit);

        return {
            users,
            total,
            totalPages,
        };
    }

    async findById(id: string): Promise<UserResponse> {
        const user = await this.db.query(
            "SELECT id, first_name, last_name, email, phone_number, role, created_at, updated_at FROM public.users WHERE id = $1",
            [id],
        );
        return user;
    }

    async findByEmail(email: string): Promise<UserResponse | null> {
        const user = await this.db.query(
            "SELECT id, first_name, last_name, email, phone_number, role, created_at, updated_at FROM public.users WHERE email = $1",
            [email],
        );
        if (user.length === 0) {
            return null;
        }
        return user;
    }

    async findByEmailWithPassword(email: string): Promise<UserResponse | null> {
        const user = await this.db.query(
            "SELECT email, password FROM public.users WHERE email = $1",
            [email],
        );
        return user;
    }

    async update(
        id: string,
        data: UpdateUserInput,
    ): Promise<UserResponse | null> {
        const filtered = Object.entries(data).filter(
            ([_, value]) => value != null,
        );

        if (filtered.length === 0) {
            return this.findById(id);
        }

        const fieldsToUpdate = filtered.map(([key, _]) => key);
        const valuesToUpdate = filtered.map(([_, value]) => value);

        const setClause = fieldsToUpdate
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const query = `UPDATE public.users SET ${setClause} WHERE id = $1 RETURNING id, first_name, last_name, email, phone_number, role, created_at, updated_at`;

        const user = await this.db.query(query, [id, ...valuesToUpdate]);
        if (user.length === 0) {
            return null;
        }
        return user;
    }

    async updatePassword(
        email: string,
        hashedPassword: string,
    ): Promise<boolean> {
        const result = await this.db.query(
            "UPDATE public.users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2",
            [hashedPassword, email],
        );
        return result > 0;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db.query(
            "DELETE FROM public.users WHERE id = $1",
            [id],
        );
        return result > 0;
    }
}
