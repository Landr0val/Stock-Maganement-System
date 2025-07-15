import { UserRepository } from "../repositories/user.repository";
import { EncryptionService } from "./encryption.service";
import { JWTService } from "./jwt.service";
import type { JWTPayload } from "./jwt.service";

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        role: string;
    };
    accessToken: string;
}

export class AuthService {
    constructor(private readonly repository: UserRepository) {}

    async login(email: string, password: string): Promise<LoginResponse> {
        const user = await this.repository.findByEmailWithPassword(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const verificationResult = await EncryptionService.verifyAndRehash(
            user.password,
            password,
        );

        if (!verificationResult.isValid) {
            throw new Error("Invalid credentials");
        }

        if (verificationResult.needsRehash && verificationResult.newHash) {
            try {
                await this.repository.updatePassword(
                    user.id,
                    verificationResult.newHash,
                );
            } catch (error) {
                console.error("Failed to update password hash:", error);
            }
        }

        const payload: JWTPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = JWTService.generateToken(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
        };
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<Boolean> {
        const user = await this.repository.findByIdWithPassword(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const [isCurrentPasswordValid, isSamePassword] = await Promise.all([
            EncryptionService.verifyPassword(user.password, currentPassword),
            EncryptionService.verifyPassword(user.password, newPassword),
        ]);

        if (!isCurrentPasswordValid) {
            throw new Error("New password is incorrect");
        }

        if (isSamePassword) {
            throw new Error("New password cannot be the same as the current password");
        }

        const newHashedPassword = await EncryptionService.hashPassword(newPassword);
        await this.repository.updatePassword(userId, newHashedPassword);

        return true;
    }
}
