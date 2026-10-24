import { Inject, Query } from "@nestjs/common";
import { CustomerResponseDto } from "../../../presentation/dtos/customer-response.dto.js";
import { ListCustomersQuery } from "../list-customers.query.js";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository.js";
import { Customer } from "../../../domain/entities/customers.entities.js";

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<ListCustomersQuery, Customer[]> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort
  ) {}

  async execute(query: ListCustomersQuery): Promise<Customer[]> {
   return await this.customerRepository.findAll();
  }
}