
export class UniqueEntityId {
    private readonly _value: string;

    constructor(value?: string) {
        this._value = value ?? crypto.randomUUID();
    }

    get value(): string {
        return this._value;
    }

    equals(id?: UniqueEntityId): boolean {
        return id ? this._value === id.value : false;

    }

    toString(): string {
        return this._value;
    }   
}