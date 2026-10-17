import { DomainException } from "../../../shared/domain/excptions/domain.excption.js";

export class Sku {
    private static readonly SKU_PATTERN = /^[A-Z0-9]+$/;
    private static readonly SKU_LENGTH = 3;
    private static readonly MAX_LENGTH = 50;
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string | null | undefined): Sku {
        if (typeof value !== 'string' || !Sku.isValid(value)) {
            throw new DomainException(`Invalid SKU: ${value ?? 'undefined'}`);
        }

        const normalizedValue = value.trim().toUpperCase();
        return new Sku(normalizedValue);
    }

    public static isValid(value: string | null | undefined): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        const trimmedValue = value.trim();
        if (trimmedValue.length < Sku.SKU_LENGTH || trimmedValue.length > Sku.MAX_LENGTH) {
            return false;
        }
        return Sku.SKU_PATTERN.test(trimmedValue);
    }

    public getValue(): string {
        return this.value;
    }

    equals(other: Sku): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
                   
}