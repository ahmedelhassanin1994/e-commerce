import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Notification,
  NotificationPort,
} from '../../application/ports/notification.ports.js';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../application/ports/customer.repository.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';
import { ApplicationException } from '../../../shared/domain/excptions/application.excptions.js';

@Injectable()
export class NodemailerEmailAdapter implements NotificationPort {
  private readonly transporter: nodemailer.Transporter;
  private readonly fromEmail: string;
  private readonly logger = new Logger(NodemailerEmailAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {
    const smtpPort = Number(this.configService.getOrThrow<string>('SMTP_PORT'));
    const smtpSecure = this.configService.get<string>('SMTP_SECURE');
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: smtpPort,
      secure:
        smtpSecure === undefined
          ? smtpPort === 465
          : smtpSecure.toLowerCase() === 'true',
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'), // generated ethereal user
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'), // generated ethereal password
      },
    });
    this.fromEmail = this.configService.getOrThrow<string>('SMTP_FROM');
  }

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recpientId),
    );
    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${notification.recpientId} not found`,
      );
    }
    const recpient = customer.getEmail();
    const mailOptions = {
      from: this.fromEmail,
      to: customer.getEmail().getValue(),
      subject: notification.subject,
      html: notification.message,
    };
    await this.transporter.sendMail(mailOptions);
    this.logger.log(
      `Notification sent to ${recpient} with subject "${notification.subject}"`,
    );
  }
}
