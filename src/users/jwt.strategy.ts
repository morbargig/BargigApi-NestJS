import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authCookies, authSecret } from '../config/auth';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({

            ignoreExpiration: false,
            secretOrKey: authSecret.authSecret,
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
                console.log('jwt cookies: ', req.cookies)
                const data = req?.cookies[authCookies.authCookie];
                if (!data) {
                    return null;
                }
                return data.token
            }])
        });
    }

    async validate(payload: any) {
        console.log("payload :", payload)
        if (payload === null) {
            throw new UnauthorizedException();
        }
        return payload;
    }
}