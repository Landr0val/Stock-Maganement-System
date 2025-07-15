import type { CreateUserInput, UpdateUserInput, UserResponse } from "../types/user.type";
import { UserRepository } from "../repositories/user.repository";
import {EncryptionService } from "./encryption.service";

export class UserService {
    constructor(private readonly repository: UserRepository) {}

    async createUser(data: CreateUserInput): Promise<UserResponse> {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new Error(`User with email ${data.email} already exists`);
        }

        const hashedPassword = await EncryptionService.hashPassword(data.password);
        const user = await this.repository.create({...data, password: hashedPassword});
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
        if (!users || users.users.length === 0) {
            throw new Error("No users found");
        }
        return users;
    }

    async findUserById(id: string): Promise<UserResponse | null> {
        const user = await this.repository.findById(id);
        if (!user || Object.keys(user).length === 0) {
            throw new Error(`User not found`);
        }
        return user;
    }

    async updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
        if (data.password) {
            const hashedPassword = await EncryptionService.hashPassword(data.password);
            data = { ...data, password: hashedPassword }
        }
        const user = await this.repository.update(id, data);
        if (!user || Object.keys(user).length === 0) {
            throw new Error(`User not found`);
        }
        return user;
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.repository.findById(id);
        if (!user || Object.keys(user).length === 0) {
            throw new Error(`User not found`);
        }
        const deleted = await this.repository.delete(id);
        return deleted;
    }
}
