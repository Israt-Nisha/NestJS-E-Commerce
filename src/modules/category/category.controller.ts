import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-respons.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

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

}
