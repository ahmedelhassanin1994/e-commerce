import { UniqueEntityId } from "../../../shared/domain/value-objects/unique-entity-id.js";

export class CustomerId extends UniqueEntityId{
    getValue(): any {
        throw new Error("Method not implemented.");
    }

    constructor(id?: string) {
        super(id);
    }

}