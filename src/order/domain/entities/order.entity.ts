import { AggregateRoot } from '@nestjs/cqrs';

interface OrderProps {}

export class Order extends AggregateRoot<OrderProps> {}
