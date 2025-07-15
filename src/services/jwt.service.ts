import jwt from "jsonwebtoken";

export interface JWTPayload {
    id: string;
    email: string;
    role: string;
}

export class JWTService {
    private static readonly SECRET =
        process.env.JWT_SECRET || "your-super-secret-key";
    private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

    static generateToken(payload: JWTPayload): string {
        return (jwt as any).sign(
            {
                id: payload.id,
                email: payload.email,
                role: payload.role,
            },
            this.SECRET,
            {
                expiresIn: this.EXPIRES_IN,
                issuer: "employee-api",
            },
        );
    }

    static verifyToken(token: string): JWTPayload {
        try {
            const decoded = (jwt as any).verify(token, this.SECRET);

            if (
                typeof decoded === "object" &&
                decoded !== null &&
                "id" in decoded &&
                "email" in decoded &&
                "role" in decoded
            ) {
                return {
                    id: decoded.id as string,
                    email: decoded.email as string,
                    role: decoded.role as string,
                };
            }

            throw new Error("Invalid token payload");
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error("Token expired");
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error("Invalid token");
            } else {
                throw new Error("Token verification failed");
            }
        }
    }
}
