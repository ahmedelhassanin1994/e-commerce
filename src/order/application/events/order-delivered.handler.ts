import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderDeliveredEvent } from '../../domain/events/order-delivered.event.js';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.ports.js';
import { OrderShippedEvent } from '../../domain/events/order_shiped.event.js';
import { Inject } from '@nestjs/common';

@EventsHandler(OrderDeliveredEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderDeliveredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderDeliveredEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId.toString(),
      subject: 'Order Delivered',
      message: `Your Clean Shop order ${event.orderId} has been delivered.`,
    });
  }
}
