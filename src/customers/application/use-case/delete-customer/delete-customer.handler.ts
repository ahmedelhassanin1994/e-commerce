import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCustomerCommand } from "./delete-customer.command.js";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository.js";
import { Inject } from "@nestjs/common";
import { ApplicationException, ApplicationExceptionType } from "../../../../shared/domain/excptions/application.excptions.js";
import { CustomerId } from "../../../domain/value-objects/customer-id.vo.js";

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
    constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

   async execute(command: DeleteCustomerCommand): Promise<any> {
         const customerId = new CustomerId(command.customerId);
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${customerId.value} not found.`,
        ApplicationExceptionType.NOT_FOUND_ERROR,
      );
    }
    await this.customerRepository.delete(customerId);
    return;
    }
    
}