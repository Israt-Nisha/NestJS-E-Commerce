import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from 'src/common/decoretors/get-user.decoretor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // register api
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new user',
        description: "Creates a new user account."
    })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request. Validation Failed',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests. Rate limit exceeded',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    @ApiResponse({
        status: 409,
        description: 'User already exists',
    })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return await this.authService.register(registerDto);
    }

    // refresh access token
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth('JWT-refresh')
    @ApiOperation({
        summary: "Refresh access token",
        description: "Generate new access token using a valid refresh token."
    })
    @ApiResponse({
        status: 200,
        description: 'New access token generated successfully',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized. Invalid or expired refresh token',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests. Rate limit exceeded',
    })
    async refresh(@GetUser('id') userId: string): Promise<AuthResponseDto> {
        return await this.authService.refreshTokens(userId);
    }

    // Logout for user and invalidate refresh token
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Logout user",
        description: "Logouts the user and invalidates the refresh token."
    })
    @ApiResponse({
        status: 200,
        description: 'User logged out successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized. Invalid or expired access token',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests. Rate limit exceeded',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
        await this.authService.logout(userId);
        return { message: 'Logged out successfully' };
    }

    // login api
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Login user",
        description: "Authenticate user and returns access and refresh tokens."
    })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized. Invalid credentials',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests. Rate limit exceeded',
    })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return await this.authService.login(loginDto);
    }
}
