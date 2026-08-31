import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-respons.dto';
import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';

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


    async findAll(queryDto: QueryCategoryDto): Promise<{ data: CategoryResponseDto[]; meta: { total: number; page: number; limit: number; totalPages: number; } }> {
        const { search, isActive, limit, page } = queryDto;

        const where: Prisma.CategoryWhereInput = {}

        if (isActive !== undefined) {
            where.isActive = isActive
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        const totalCategories = await this.prisma.category.count({ where });
        const categories = await this.prisma.category.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });


        return {
            data: categories.map((category) => this.formatCategoryResponse(category, category._count.products)),
            meta: {
                total: totalCategories,
                page,
                limit,
                totalPages: Math.ceil(totalCategories / limit),
            }
        }

    }


    async findOne(id: string): Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return this.formatCategoryResponse(category, category._count.products);
    }


    async findBySlug(slug: string): Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!category) {
            throw new NotFoundException(`Category with slug ${slug} not found`);
        }

        return this.formatCategoryResponse(category, category._count.products);
    }

    private formatCategoryResponse(category: Category, productsCount: number): CategoryResponseDto {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.imageUrl,
            isActive: category.isActive,
            productsCount: productsCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }
}
