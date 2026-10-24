import { Module } from "@nestjs/common";
import { DrizzleCustomerRepository } from "./infrastructure/adapters/drizzle-customer.repository.js";
import { CUSTOMER_REPOSITORY } from "./application/ports/customer.repository.js";
import { CommandHandlers } from "./application/use-case/index.js";
import { CustomerController } from "./presentation/customer.controller.js";
import { QueryHandlers } from "./application/queries/handlers/index.js";

@Module({
    controllers: [
      CustomerController
    ],
    providers: [
      ...CommandHandlers,
      ...QueryHandlers,
      {
        provide: CUSTOMER_REPOSITORY,
        useClass: DrizzleCustomerRepository,
      }
    ],
    exports: [],
})
export class CustomersModule {

}