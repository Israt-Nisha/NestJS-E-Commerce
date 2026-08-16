// Users Service

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserResponseDTO } from "./dto/user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // Get user by ID
    async findOne(id: string): Promise<UserResponseDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Get all users
    async findAll(): Promise<UserResponseDTO[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // Update user
    async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDTO> {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        // Prevent email change if it conflicts with another user
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const userWithSameEmail = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email }
            });
            if (userWithSameEmail) {
                throw new NotFoundException('Email already in use');
            }
        }

        // Update user data
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            }
        });

        return updatedUser;
    }


}
