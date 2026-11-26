import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { getOrderQuery } from '../get-order.query.js';
import { Order } from '../../../domain/entities/order.entity.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order.repository.port.js';
import { Inject, Query } from '@nestjs/common';
import { OrderId } from '../../../domain/value-objects/order-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionType,
} from '../../../../shared/domain/excptions/application.excptions.js';

@QueryHandler(getOrderQuery)
export class GetOrderHandler implements IQueryHandler<getOrderQuery, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: getOrderQuery): Promise<Order> {
    const order = await this.orderRepository.findById(
      new OrderId(query.orderId),
    );

    if (!order) {
      throw new ApplicationException(
        'order with ID ${query.orderId} not found',
        ApplicationExceptionType.NOT_FOUND_ERROR,
      );
    }
    return order;
  }
}
