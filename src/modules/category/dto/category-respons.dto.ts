// category response dto

import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {

    @ApiProperty({
        example: 'a3a5f8c1-14a8-44c5-aeac-6b01d0d0856a',
        description: 'The id of the Category',
    })
    id: string;

    @ApiProperty({
        example: 'Electronics',
        description: 'The name of the Category',
    })
    name: string;

    @ApiProperty({
        example: 'electronics',
        description: 'The slug of the Category',
    })
    slug: string;

    @ApiProperty({
        example: 'A category for electronic products',
        description: 'The description of the Category',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        example: 'https://example.com/image.jpg',
        description: 'The image url of the Category',
        nullable: true,
    })
    image: string | null;

    @ApiProperty({
        example: true,
        description: 'The status of the Category',
    })
    isActive: boolean;

    @ApiProperty({
        example: 10,
        description: 'The number of products in the Category',
    })
    productsCount: number;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The creation date of the Category',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The update date of the Category',
    })
    updatedAt: Date;
}