import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ORDER_REPOSITORY } from './application/ports/order.repository.port.js';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';
import { PlaceOrderHandler } from './application/use-cases/place-order/place-order.handler.js';
import { OrderController } from './presentation/order.controller.js';
import { CommandHandlers } from './application/indext.js';
import { CUSTOMER } from './application/ports/customer.port.js';
import { CustomerAdapter } from './infrastructure/adapters/customer.adapters.js';
import { PRODUCT } from './application/ports/product.port.js';
import { ProductAdapter } from './infrastructure/adapters/product.adapter.js';
import { CustomersModule } from '../customers/customers.module.js';
import { ProductModule } from '../product/product.module.js';
import { EventHandlers } from './application/events/index.js';
import { QueryHandlers } from './application/querys/handlers/index.js';

@Module({
  imports: [CqrsModule, CustomersModule, ProductModule],
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
    {
      provide: CUSTOMER,
      useClass: CustomerAdapter,
    },
    {
      provide: PRODUCT,
      useClass: ProductAdapter,
    },
  ],
  exports: [],
})
export class OrderModule {}
