import { Inject, Injectable } from "@nestjs/common";
import { CustomerRepositoryPort } from "../../application/ports/customer.repository.js";
import { DRIZZLE, DrizzleDb } from "../../../shared/infrastructure/database/postgres/drizzle.providor.js";
import { Customer } from "../../domain/entities/customers.entities.js";
import { CustomerId } from "../../domain/value-objects/customer-id.vo.js";
import { Email } from "../../domain/value-objects/email.vo.js";
import { customers } from "../../../shared/infrastructure/database/postgres/schema/customer.schema.js";




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
    throw new Error("Method not implemented.");
  }
  async findByEmail(email: Email): Promise<Customer | null> {
    throw new Error("Method not implemented.");
  }
  async findAll(): Promise<Customer[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: CustomerId): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private static toPersistence(
    customer: Customer,
  ): Omit<typeof customers.$inferSelect, "password"> {
    return {
      id: customer.getId().getValue(),
      email: customer.getEmail().getValue(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      phone: customer.getPhone(),
      isActive: customer.getIsActive(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };
  }
}