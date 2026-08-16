// updateing user information DTO

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";


export class UpdateUserDto {
    @ApiProperty({
        description: 'User email Address',
        example: 'user@example.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
        required: false,
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        required: false
    })
    @IsString()
    @IsOptional()
    lastName?: string;

}

