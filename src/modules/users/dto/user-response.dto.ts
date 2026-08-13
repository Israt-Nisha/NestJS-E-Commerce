// DTO

import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UserResponseDTO {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' })
    id: string;

    @ApiProperty({ example: 'user@example.com', description: 'User Email Address' })
    email: string;

    @ApiProperty({ example: 'John', description: 'User First Name', nullable: true })
    firstName: string | null;

    @ApiProperty({ example: 'Doe', description: 'User Last Name', nullable: true })
    lastName: string | null;

    @ApiProperty({ enum: Role, description: 'User Role' })
    role: Role;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Account creation date' })
    createdAt: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last account update date' })
    updatedAt: Date;

}