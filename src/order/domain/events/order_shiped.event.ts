export class OrderShippedEvent {
  constructor(
    public readonly orderId: string,
    public readonly trakingNumber: String,
    public readonly customerId: String,
  ) {}
}
