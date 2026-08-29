//  query category dto

import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class QueryCategoryDto {



    @ApiProperty({
        description: 'filter by active status',
        example: true
    })

    @Transform(({ value }) => {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return undefined;
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({
        description: 'Search term for filtering categories',
        required: false,
        example: 'electronics'
    })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiProperty({
        description: 'Page number for pagination',
        example: 1,
        default: 1,
        minimum: 1,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @ApiProperty({
        description: 'Number of items per page for pagination',
        example: 10,
        default: 10,
        minimum: 1,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    limit: number = 10;

}