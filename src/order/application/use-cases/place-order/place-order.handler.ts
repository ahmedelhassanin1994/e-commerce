import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PlaceOrderCommand } from './place-order.command.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order.repository.port.js';
import { OrderItem } from '../../../domain/entities/order-item.entity.js';
import { Money } from '../../../../shared/domain/value-objects/money.vo.js';
import { ShippingAddress } from '../../../domain/value-objects/shipping-address.vo.js';
import { Order } from '../../../domain/entities/order.entity.js';
import { CUSTOMER, CustomerPort } from '../../ports/customer.port.js';
import { PRODUCT, ProductPort } from '../../ports/product.port.js';
import {
  ApplicationException,
  ApplicationExceptionType,
} from '../../../../shared/domain/excptions/application.excptions.js';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
    @Inject(CUSTOMER)
    private readonly customerPort: CustomerPort,
    @Inject(PRODUCT)
    private readonly ProductPort: ProductPort,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<void> {
    const customerExists = await this.customerPort.exists(command.customerId);
    if (!customerExists) {
      throw new ApplicationException(
        `Customer with id ${command.customerId} not found`,
        ApplicationExceptionType.NOT_FOUND_ERROR,
      );
    }

    for (const item of command.items) {
      const productExists = await this.ProductPort.exists(item.productId);
      if (!productExists) {
        throw new ApplicationException(
          `Product with id ${item.productId} not found`,
          ApplicationExceptionType.NOT_FOUND_ERROR,
        );
      }
    }
    const items = command.items.map((item) =>
      OrderItem.create(
        item.productId,
        item.productName,
        Money.create(item.unitPrice, item.currency),
        item.quantity,
        item.discount !== undefined
          ? Money.create(item.discount, item.currency)
          : undefined,
      ),
    );

    const shippingAddress = ShippingAddress.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      state: command.shippingState,
      zipCode: command.shippingZipCode,
      country: command.shippingCountry,
    });

    const order = this.eventPublisher.mergeObjectContext(
      Order.place(command.customerId, items, shippingAddress),
    );

    await this.orderRepository.save(order);

    order.commit();
  }
}
