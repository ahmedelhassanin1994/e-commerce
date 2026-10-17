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

  save(customer: Customer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: CustomerId): Promise<Customer | null> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: Email): Promise<Customer | null> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Customer[]> {
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