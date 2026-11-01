import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerRegisteredEvent } from '../../domain/events/customer-registered.event.js';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../ports/notification.ports.js';

@EventsHandler(CustomerRegisteredEvent)
export class CustomersRegisteredHandler implements IEventHandler<CustomerRegisteredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: CustomerRegisteredEvent) {
    await this.notificationService.sendNotification({
      recpientId: event.customerId,
      subject: 'Welcome',
      message: `Hello ${event.firstName}, welcome to e-commerce. Your account has been created.`,
    });
  }
}
