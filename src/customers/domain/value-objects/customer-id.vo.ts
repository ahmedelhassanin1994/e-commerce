import { UniqueId } from '../../../shared/domain/value-objects/unique-entity-id.js';

export class CustomerId extends UniqueId {
  constructor(id?: string) {
    super(id);
  }
}
