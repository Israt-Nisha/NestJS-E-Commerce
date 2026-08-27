// category dto for create

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Electronics',
        description: 'The name of the Category',
        maxLength: 100,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: 'electronics',
        description: 'Category slug',
        required: false,
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 'A category for electronic products',
        description: 'The description of the Category',
        required: false,
    })
    @IsString()
    @MaxLength(255)
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 'https://example.com/image.jpg',
        description: 'The image url of the Category',
        required: false,
        maxLength: 255,
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    image?: string;

    @ApiProperty({
        example: true,
        description: 'The status of the Category',
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}