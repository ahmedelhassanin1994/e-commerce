import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  NotificationPort,
  Notification,
} from '../../application/ports/notification.ports.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../application/ports/customer.repository.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recpientId),
    );
    const recpient = customer?.getEmail() ?? notification.recpientId;

    this.logger.log(
      `[${notification.subject}] to ${recpient} ${notification.message} `,
    );
  }
}
