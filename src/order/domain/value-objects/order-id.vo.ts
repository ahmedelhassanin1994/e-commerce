import { UniqueId } from '../../../shared/domain/value-objects/unique-entity-id.js';

export class OrderId extends UniqueId {
  constructor(id?: string) {
    super(id);
  }
}
