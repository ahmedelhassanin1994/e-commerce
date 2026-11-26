import { DomainException } from '../../../shared/domain/excptions/domain.excption.js';

interface shippingAddressProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class ShippingAddress {
  private readonly _street: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _zipCode: string;
  private readonly _country: string;

  private constructor(props: shippingAddressProps) {
    this._street = props.street;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
    this._country = props.country;
  }

  static create(props: shippingAddressProps): ShippingAddress {
    if (
      !props.street ||
      !props.street.trim() ||
      props.street.trim().length === 0
    ) {
      throw new DomainException(
        'Street is required to create a ShippingAddress',
      );
    }
    if (!props.city || !props.city.trim() || props.city.trim().length === 0) {
      throw new DomainException('City is required to create a ShippingAddress');
    }
    if (
      !props.state ||
      !props.state.trim() ||
      props.state.trim().length === 0
    ) {
      throw new DomainException(
        'State is required to create a ShippingAddress',
      );
    }
    if (
      !props.zipCode ||
      !props.zipCode.trim() ||
      props.zipCode.trim().length === 0
    ) {
      throw new DomainException(
        'Zip Code is required to create a ShippingAddress',
      );
    }
    if (
      !props.country ||
      !props.country.trim() ||
      props.country.trim().length !== 2
    ) {
      throw new DomainException(
        'Country is required to create a ShippingAddress',
      );
    }
    return new ShippingAddress({
      street: props.street.trim(),
      city: props.city.trim(),
      state: props.state.trim(),
      zipCode: props.zipCode.trim(),
      country: props.country.trim(),
    });
  }

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get country(): string {
    return this._country;
  }

  equals(other: ShippingAddress): boolean {
    return (
      this._street === other.street &&
      this._city === other.city &&
      this._state === other.state &&
      this._zipCode === other.zipCode &&
      this._country === other.country
    );
  }

  toString(): string {
    return `${this._street}, ${this._city}, ${this._state}, ${this._zipCode}, ${this._country}`;
  }
}
