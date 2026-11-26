import { OrderCancelledHandler } from './order-cancelled.handler.js';
import { OrderConfirmedHandler } from './order-confirmed.handler.js';
import { OrderPlacedHandler } from './order-placed.handler.js';
import { OrderShippedHandler } from './order-shipped.handlers.js';

export const EventHandlers = [
  OrderPlacedHandler,
  OrderConfirmedHandler,
  OrderShippedHandler,
  OrderCancelledHandler,
];
