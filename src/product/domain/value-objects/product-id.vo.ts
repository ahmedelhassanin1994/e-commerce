import { UniqueId } from '../../../shared/domain/value-objects/unique-entity-id.js';

export class ProductId extends UniqueId {
  constructor(id?: string) {
    super(id);
  }
}
