import { Body, Controller, Post } from "@nestjs/common";
import { CustomerRepositoryPort } from "../application/ports/customer.repository.js";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RegisterCustomerDto } from "./dtos/register-customer.dto.js";
import { CustomerResponseDto } from "./dtos/customer-response.dto.js";


@Controller('customers')
export class CustomerController {
  constructor( 
     private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) {}


    @Post('register')
    async register(@Body() dto: RegisterCustomerDto): Promise<CustomerResponseDto> {

    }

  
  }
