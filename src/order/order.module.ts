import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port.js';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
  ],
  exports: [],
})
export class OrderModule {}
