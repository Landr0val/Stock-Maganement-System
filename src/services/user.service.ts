import type { CreateUserInput, UpdateUserInput, UserResponse } from "../types/user.type";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    constructor(private readonly repository: UserRepository) {}

    async createUser(data: CreateUserInput): Promise<UserResponse> {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new Error(`User with email ${data.email} already exists`);
        }
        const user = await this.repository.create(data);
        return user;
    }

    async findAllUsers(options: {
        page: number;
        limit: number;
        filter?: { role?: string };
    }): Promise<{
        users: UserResponse[];
        total: number;
        totalPages: number;
    }> {
        const users = await this.repository.findAll(options);
        return users;
    }

    async findUserById(id: string): Promise<UserResponse | null> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    async updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
        const user = await this.repository.update(id, data);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    async deleteUser(id: string): Promise<boolean> {
        const deleted = await this.repository.delete(id);
        return deleted;
    }
}
