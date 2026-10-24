import { UniqueEntityId } from "../../../shared/domain/value-objects/unique-entity-id.js";

export class CustomerId extends UniqueEntityId{
    getValue(): string {
        return this.value;
    }

    constructor(id?: string) {
        super(id);
    }

}