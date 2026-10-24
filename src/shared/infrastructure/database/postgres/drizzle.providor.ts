import { ConfigService } from "@nestjs/config";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";
import { sql } from "drizzle-orm/sql/sql";

export const DRIZZLE = Symbol.for("DRIZZLE");

export type DrizzleDb = PostgresJsDatabase<typeof schema>;

export const DrizzleProvider = {
    provide: DRIZZLE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<DrizzleDb> => {
        const connectionString = configService.getOrThrow<string>('POSTGRES_DATABASE_URL');
        const client = postgres(connectionString);
        const db= drizzle(client, { schema });

        await db.execute(sql`select 1`); // Test the connection

        return db;
    },
}

