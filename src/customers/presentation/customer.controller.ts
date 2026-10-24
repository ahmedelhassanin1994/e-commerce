import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CustomerRepositoryPort } from "../application/ports/customer.repository.js";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RegisterCustomerDto } from "./dtos/register-customer.dto.js";
import { CustomerResponseDto } from "./dtos/customer-response.dto.js";
import { RegisterCustomerCommand } from "../application/use-case/register-customer/register-customer.command.js";
import { ListCustomersQuery } from "../application/queries/list-customers.query.js";
import { Customer } from "../domain/entities/customers.entities.js";
import { GetCustomerQuery } from "../application/queries/get-customer.query.js";
import { DeleteCustomerCommand } from "../application/use-case/delete-customer/delete-customer.command.js";


@Controller('customers')
export class CustomerController {
  constructor( 
     private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) {}


    @Post()
    async register(@Body() dto: RegisterCustomerDto): Promise<void> {
     await this.commandBus.execute<RegisterCustomerCommand, void>(new RegisterCustomerCommand(dto.firstName, dto.lastName, dto.email, dto.phone));
    }

    @Get()
    async getAll(): Promise<CustomerResponseDto[]> {
      const customers= await this.queryBus.execute<ListCustomersQuery, Customer[]>(new ListCustomersQuery());
      return customers.map(CustomerResponseDto.fromDomain)
    }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<CustomerResponseDto> {
      const customer= await this.queryBus.execute<GetCustomerQuery, Customer>(new GetCustomerQuery(id));
      return CustomerResponseDto.fromDomain(customer)
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
      await this.commandBus.execute(new DeleteCustomerCommand(id));
    }

  }
