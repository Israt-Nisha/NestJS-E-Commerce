// Refresh Token Strategy

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcypt from 'bcrypt';
import { Request } from "express";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        })
    }

    // validate JWT payload
    async validate(req: Request, payload: { sub: string, email: string }) {
        console.log('RefreshTokenStrategy.validate called');
        console.log('Payload:', { sub: payload.sub, email: payload.email });

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.error('No authorization header found in request');
            throw new UnauthorizedException('Refresh token not found');
        }

        const refreshToken = authHeader.replace('Bearer ', '').trim();
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is empty after extraction');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                refreshToken: true,
            }
        });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const refreshTokenMatches = await bcypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Refresh token does not match');
        }

        return { id: user.id, email: user.email, role: user.role };
    }

}