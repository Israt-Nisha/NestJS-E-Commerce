// change-password.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ example: 'currentP@ssword', description: 'Current password' })
    @IsString()
    @IsNotEmpty({ message: 'Current password is required' })
    currentPassword: string;

    @ApiProperty({ example: 'newP@ssword', description: 'New password' })
    @IsString()
    @IsNotEmpty({ message: 'New password is required' })
    @MinLength(8, { message: 'New password must be at least 8 characters long' })
    newPassword: string;
}