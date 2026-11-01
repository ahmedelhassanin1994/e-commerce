import { Module } from '@nestjs/common';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository.js';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.js';
import { NOTIFICATION_SERVICE } from './application/ports/notification.ports.js';
import { CommandHandlers } from './application/use-case/index.js';
import { CustomerController } from './presentation/customer.controller.js';
import { QueryHandlers } from './application/queries/handlers/index.js';
import { EventsHandelr } from './application/events/index.js';
import { NodemailerEmailAdapter } from './infrastructure/adapters/nodemailer-notification.adapter.js';

@Module({
  controllers: [CustomerController],
  providers: [
    ...CommandHandlers,
    ...EventsHandelr,
    ...QueryHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NodemailerEmailAdapter,
    },
  ],
  exports: [],
})
export class CustomersModule {}
