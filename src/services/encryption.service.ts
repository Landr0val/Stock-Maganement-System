import { hash, verify } from '@node-rs/argon2';

export class EncryptionService {
    private static readonly hashOptions = {
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 2,
        outputLen: 32, // 32 bytes
        paralelism: 1,
    }

    static async hashPassword(password: string): Promise<string> {
        try {
            return await hash(password, this.hashOptions);
        } catch (error) {
            throw new Error(`Failed to hash password: ${error}`);
        }
    }

    static async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
        try {
            return await verify(hashedPassword, password);
        } catch (error) {
            throw new Error(`Failed to verify password: ${error}`);
        }
    }

    static async needsRehash(hashedPassword: string): Promise<boolean> {
        try {
            const currentHash = await hash('', this.hashOptions);
            const currentHashParts = currentHash.split('$');
            const storedHashparts = hashedPassword.split('$');

            if (currentHashParts.length < 6 || storedHashparts.length < 6) {
                return true;
            }

            const currentParams = currentHashParts[3];
            const storedParams = storedHashparts[3];
            return currentParams !== storedParams;
        } catch (error) {
            return true; // <- If there's an error, we assume rehashing is needed
        }
    }
}
