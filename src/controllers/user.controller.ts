import type { CreateUserInput, UpdateUserInput, UserResponse } from "../types/user.type";
import { UserService } from "../services/user.service";

export class UserController {
    constructor(private readonly userService: UserService) {}

    async createUser(data: CreateUserInput): Promise<UserResponse> {
        return await this.userService.createUser(data);
    }

    async findAllUsers(options: {
        page: number;
        limit: number;
        filter?: { role?: string; };
    }): Promise<{
        users: UserResponse[];
        total: number;
        totalPages: number;
    }> {
        return await this.userService.findAllUsers(options);
    }

    async findUserById(id: string): Promise<UserResponse | null> {
        return await this.userService.findUserById(id);
    }

    async updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
        return await this.userService.updateUser(id, data);
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.userService.deleteUser(id);
    }
}
