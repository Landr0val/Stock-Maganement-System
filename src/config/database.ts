import { Pool } from "pg";

const types = require('pg').types;
types.setTypeParser(20, (val: string) => BigInt(val));

export class DatabasePool {
    private static instance: Pool;

    public static getInstance() {
        if (!DatabasePool.instance) {
            DatabasePool.instance = new Pool({
                host: process.env.DB_HOST || "localhost",
                port: parseInt(process.env.DB_PORT || "5432"),
                database: process.env.DB_NAME || "postgres",
                user: process.env.DB_USER || "postgres",
                password: process.env.DB_PASSWORD || "password",
                max: 50,
                min: 5,
                idleTimeoutMillis: 60000,
                connectionTimeoutMillis: 5000,
            });
        }
        return DatabasePool.instance;
    }

    public static async closePool(): Promise<void> {
        if (DatabasePool) {
            await DatabasePool.instance.end();
        }
    }
}
