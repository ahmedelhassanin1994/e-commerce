import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.ports.js';
import { OrderShippedEvent } from '../../domain/events/order_shiped.event.js';

@EventsHandler(OrderShippedEvent)
export class OrderShippedHandler implements IEventHandler<OrderShippedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId.toString(),
      subject: 'Order Shipped',
      message: `Your Clean Shop order ${event.orderId} has been shipped. Your tracking number is ${event.trakingNumber}`,
    });
  }
}
