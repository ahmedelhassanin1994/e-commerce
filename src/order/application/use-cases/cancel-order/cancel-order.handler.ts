import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order.repository.port.js';
import { OrderId } from '../../../domain/value-objects/order-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionType,
} from '../../../../shared/domain/excptions/application.excptions.js';
import { CancelOrderCommand } from './cancel-order.command.js';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<
  CancelOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );
    if (!order) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} not found`,
        ApplicationExceptionType.NOT_FOUND_ERROR,
      );
    }
    const trackedOrder = this.eventPublisher.mergeObjectContext(order);
    trackedOrder.cancel(command.reason);
    await this.orderRepository.save(trackedOrder);
    trackedOrder.commit();
  }
}
