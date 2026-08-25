import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { UserResponseDTO } from './dto/user-response.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/common/decoretors/get-user.decoretor';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    // Get user profile
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'The current user profile',
        type: UserResponseDTO
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMe(@Req() req: RequestWithUser): Promise<UserResponseDTO> {
        return this.userService.findOne(req.user.id);
    }


    // Get all users (for admins purpose)
    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'The list of all users',
        type: [UserResponseDTO]
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async findAll() {
        return this.userService.findAll();
    }

    // Get user  by id (for admins purpose)
    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({
        status: 200,
        description: 'The user found by ID',
        type: UserResponseDTO
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string): Promise<UserResponseDTO> {
        return this.userService.findOne(id);
    }

    // Update user profile
    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiBody({
        type: UpdateUserDto
    })
    @ApiResponse({
        status: 200,
        description: 'The updated user profile',
        type: UserResponseDTO
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async updateProfile(
        @GetUser('id')
        userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDTO> {
        return this.userService.update(userId, updateUserDto);
    }

    // Update current user password
    @Patch('me/password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update current user password' })
    @ApiResponse({
        status: 200,
        description: 'The updated user password',
        type: UserResponseDTO
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async updatePassword(
        @GetUser('id')
        userId: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        return this.userService.updatePassword(
            userId,
            changePasswordDto
        );
    }


    // Delete current user
    @Delete('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete current user' })
    @ApiResponse({
        status: 200,
        description: 'The deleted user',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteProfile(
        @GetUser('id')
        userId: string): Promise<{ message: string }> {
        return this.userService.delete(userId);
    }

    // Delete user by ID (for admins purpose)
    @Delete(':id')
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiResponse({
        status: 200,
        description: 'The deleted user with the specified ID',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(
        @Param('id')
        userId: string): Promise<{ message: string }> {
        return this.userService.delete(userId);
    }



}
