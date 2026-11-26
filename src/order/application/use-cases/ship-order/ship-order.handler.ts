import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ShipOrderCommand } from './ship-order.command.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order.repository.port.js';
import { Inject } from '@nestjs/common';
import { OrderId } from '../../../domain/value-objects/order-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionType,
} from '../../../../shared/domain/excptions/application.excptions.js';

@CommandHandler(ShipOrderCommand)
export class ShipOrderHandlers implements ICommandHandler<
  ShipOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ShipOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );
    if (!order) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} not found`,
        ApplicationExceptionType.NOT_FOUND_ERROR,
      );
    }

    const trakingOrder = this.eventPublisher.mergeObjectContext(order);
    trakingOrder.ship(command.trackingNumber);
    await this.orderRepository.save(trakingOrder);
    trakingOrder.commit();
  }
}
