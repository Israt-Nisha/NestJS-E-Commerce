import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-respons.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    // create a new category
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({
        type: CreateCategoryDto
    })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        return this.categoryService.createCategory(createCategoryDto);
    }


    // Get all categories
    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        status: 200, description: 'Categories retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        $ref: "#/components/schemas/CategoryResponseDto"
                    }
                }
                ,
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        limit: { type: 'number' },

                        totalPages: { type: 'number' },
                    }
                }

            },
        }
    })
    async findAll(@Query() queryDto: QueryCategoryDto) {
        return this.categoryService.findAll(queryDto);
    }

    // Get category by id
    @Get(':id')
    @ApiOperation({ summary: 'Get category by id' })
    @ApiResponse({ status: 200, description: 'Category retrieved successfully', type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
        return this.categoryService.findOne(id);
    }

    // get category by slug
    @Get(':slug')
    @ApiOperation({ summary: 'Get category by slug' })
    @ApiResponse({ status: 200, description: 'Category retrieved successfully', type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
        return this.categoryService.findBySlug(slug);
    }


}
