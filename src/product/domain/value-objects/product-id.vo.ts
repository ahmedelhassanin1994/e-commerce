import { UniqueEntityId } from "../../../shared/domain/value-objects/unique-entity-id.js";


export class ProductId extends UniqueEntityId{

    constructor(id?: string) {
        super(id);
    }

}