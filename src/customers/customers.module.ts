import { Module } from "@nestjs/common";
import { DrizzleCustomerRepository } from "./infrastructure/adapters/drizzle-customer.repository.js";
import { CUSTOMER_REPOSITORY } from "./application/ports/customer.repository.js";

@Module({
    providers: [
      {
        provide: CUSTOMER_REPOSITORY,
        useClass: DrizzleCustomerRepository,
      }
    ],
    exports: [],
})
export class CustomersModule {

}