import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCustomerCommand } from "./register-customer.command.js";
import { Customer } from "../../../domain/entities/customers.entities.js";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository.js";
import { Inject } from "@nestjs/common";
import { Email } from "../../../domain/value-objects/email.vo.js";
import { ApplicationException, ApplicationExceptionType } from "../../../../shared/domain/excptions/application.excptions.js";

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler implements ICommandHandler<RegisterCustomerCommand, void> {


    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: CustomerRepositoryPort
    ) {

    }

    async execute(command: RegisterCustomerCommand): Promise<void> {
        const email= Email.create(command.email);
        const existing =await this.customerRepository.findByEmail(email);
        if (existing) {
            throw new ApplicationException('Customer with this email already exists',ApplicationExceptionType.CONFLICT_ERROR);
        }
        const customer = Customer.register(email, command.firstName, command.lastName, command.phone);
        await this.customerRepository.save(customer);

    }   
    
   }