import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event.js';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.ports.js';

@EventsHandler(OrderPlacedEvent)
export class OrderPlacedHandler implements IEventHandler<OrderPlacedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderPlacedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Confirmation',
      message: `Your Clean Shop order ${event.orderId} has been confirmed. Thank you for your purchase!`,
    });
  }
}
