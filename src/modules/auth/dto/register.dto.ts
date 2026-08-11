// Data transper object (DTO) for user registration

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

    @ApiProperty({
        description: "User's email address",
        example: "john.doe@example.com",
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: "User's password",
        example: "Strong@Password!",
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @ApiProperty({
        description: "User's first name",
        example: "John",
        required: false,
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({
        description: "User's last name",
        example: "Doe",
        required: false,
    })
    @IsString()
    @IsOptional()
    lastName?: string;
}