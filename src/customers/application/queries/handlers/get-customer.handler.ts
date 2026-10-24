import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ApplicationException, ApplicationExceptionType } from "../../../../shared/domain/excptions/application.excptions.js";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository.js";
import { GetCustomerQuery } from "../get-customer.query.js";
import { Inject } from "@nestjs/common";
import { Customer } from "../../../domain/entities/customers.entities.js";
import { CustomerId } from "../../../domain/value-objects/customer-id.vo.js";

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery, Customer> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customerId = new CustomerId(query.customerId);
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${customerId.value} not found.`,
        ApplicationExceptionType.NOT_FOUND_ERROR,
      );
    }
    return customer;
  }
}