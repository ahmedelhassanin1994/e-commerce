import { Inject, Injectable } from "@nestjs/common";
import { CustomerRepositoryPort } from "../../application/ports/customer.repository.js";
import { DRIZZLE, DrizzleDb } from "../../../shared/infrastructure/database/postgres/drizzle.providor.js";
import { Customer } from "../../domain/entities/customers.entities.js";
import { CustomerId } from "../../domain/value-objects/customer-id.vo.js";
import { Email } from "../../domain/value-objects/email.vo.js";
import { customers } from "../../../shared/infrastructure/database/postgres/schema/customer.schema.js";
import { and, eq, gte, lte, SQL } from "drizzle-orm";


type CustomerRow = typeof customers.$inferSelect;

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort {

    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {
        
    }

  async save(customer: Customer): Promise<void> {
    const data = DrizzleCustomerRepository.toPersistence(customer);
    await this.db.insert(customers).values(data).onConflictDoUpdate({
      target: customers.id,
      set: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
    });
  }
  async findById(id: CustomerId): Promise<Customer | null> {
    const rows = await this.db.select().from(customers).where(eq(customers.id, id.getValue()));
    return rows.length > 0 ? DrizzleCustomerRepository.toDomain(rows[0]) : null;
  }
  async findByEmail(email: Email): Promise<Customer | null> {
    const rows = await this.db.select().from(customers).where(eq(customers.email, email.getValue()));
    return rows.length > 0 ? DrizzleCustomerRepository.toDomain(rows[0]) : null;
  }
  async findAll(): Promise<Customer[]> {
   const rows = await this.db.select().from(customers);
   return rows.map(DrizzleCustomerRepository.toDomain);
  }
  async delete(id: CustomerId): Promise<void> {
    await this.db.delete(customers).where(eq(customers.id, id.getValue()));
  }

  private static toPersistence(
    customer: Customer,
  ): CustomerRow {
    return {
      id: customer.getId().getValue(),
      email: customer.getEmail().getValue(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      phone: customer.getPhone(),
      isActive: customer.getIsActive(),
      password: null,
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };
  }

  private static toDomain(row: CustomerRow): Customer {
    return Customer.reconstitute({
      id: new CustomerId(row.id),
      email: new Email(row.email),
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

}