import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-respons.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const { name, slug, ...rest } = createCategoryDto;

        const categorySlug = slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const existingCategory = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
        });

        if (existingCategory) {
            throw new Error('Category already exists' + categorySlug);
        }
        const category = await this.prisma.category.create({
            data: {
                name,
                slug: categorySlug,
                ...rest
            },

        });

        return this.formatCategoryResponse(category, 0);
    }

    private formatCategoryResponse(category: Category, productsCount: number): CategoryResponseDto {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: "",
            image: category.imageUrl,
            isActive: category.isActive,
            productsCount: productsCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }
}
