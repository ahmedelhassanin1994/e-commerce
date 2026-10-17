import { UniqueEntityId } from "./value-objects/unique-entity-id.js";


export abstract class Entity<T extends UniqueEntityId = UniqueEntityId> {
    protected constructor(public readonly id: T) { }

    getId(): T {
        return this.id;
    }

    equals(entity: Entity<T>): boolean {
        if (entity === null || entity === undefined) {
            return false;
        }

        if (!(entity instanceof Entity)) {
            return false;
        }

        return this.id.equals(entity.id);
    }

    toString(): string {
        return `${this.constructor.name} [id=${this.id.toString()}]`;
    }


}