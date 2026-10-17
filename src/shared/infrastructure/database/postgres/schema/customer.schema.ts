import { pgTable } from "drizzle-orm/pg-core/table";
import { boolean, integer, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const  customers= pgTable("customers", {
    id: uuid("id").primaryKey(),    
    email: varchar("email", { length: 255 }).notNull().unique(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    isActive: boolean("is_active").notNull().default(true),
    password: varchar("password", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
        
});
