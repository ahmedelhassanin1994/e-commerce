import { DomainException } from "../../../shared/domain/excptions/domain.excption.js";

export class Email {

    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    static create(value: string): Email {
        const trimmed= value.trim();
        if(!trimmed ) {
            throw new DomainException('Email cannot be empty');
        }
        if(!this.EMAIL_REGEX.test(trimmed)) {
            throw new DomainException('Invalid email format');
        }
        return new Email(trimmed);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

}