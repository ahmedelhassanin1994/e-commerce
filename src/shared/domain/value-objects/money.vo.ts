import { DomainException } from "../excptions/domain.excption.js";

export class Money {
    private constructor(private readonly amount: number, private readonly currency: string) { }
    
    static create(amount: number, currency: string = 'USD'): Money {
        if (amount < 0) {
            throw new DomainException('Amount cannot be negative');
        }
        const normalizedAmount = Math.max(0, Math.floor(amount * 100)) / 100; // Normalize to two decimal places
        const normalizedCurrency = currency.toUpperCase();

        return new Money(normalizedAmount, normalizedCurrency);
    } 
    
    getAmount(): number {
        return this.amount;
    }

    getCurrency(): string {
        return this.currency;
    }

    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new DomainException('Cannot add amounts with different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    subtract(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new DomainException('Cannot subtract amounts with different currencies');
        }
        const resultAmount = this.amount - other.amount;
        if (resultAmount < 0) {
            throw new DomainException('Resulting amount cannot be negative');
        }
        return new Money(resultAmount, this.currency);
    }

    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }

    toCents(): number {
        return Math.round(this.amount * 100);
    }

    static fromCents(cents: number, currency: string = 'USD'): Money {
        if (cents < 0) {
            throw new Error('Cents cannot be negative');
        }
        const amount = cents / 100;
        return new Money(amount, currency.toUpperCase());
    }
}