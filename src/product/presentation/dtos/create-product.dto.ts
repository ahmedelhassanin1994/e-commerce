
import { IsNumber, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto { 

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;  

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @Matches(/^[A-Z0-9]+$/, { message: 'SKU must contain only uppercase letters and numbers' }) 
    sku: string;

    @IsString()
    @IsOptional()
    currency?: string= "USD";
    @IsNumber()
    @Min(0)
    stock: number;
}