import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "./users.service";
import { authCookies, authSecret } from '../config/auth';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(private userService: UsersService) {
        super({
            ignoreExpiration: true,
            passReqToCallback: true,
            secretOrKey: authSecret.authSecret,
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                const data = request?.cookies[authCookies.authCookie];
                if (!data) {
                    return null;
                }
                return data.token
            }])
        })
    }

    async validate(req: Request, payload: any) {
        if (!payload) {
            throw new BadRequestException('invalid jwt token');
        }
        const data = req?.cookies[authCookies.authCookie];
        if (!data?.refreshToken) {
            throw new BadRequestException('invalid refresh token');
        }
        const user = await this.userService.validateRefreshToken(payload.email, data.refreshToken);
        if (!user) {
            throw new BadRequestException('token expired');
        }
        return user;
    }
}