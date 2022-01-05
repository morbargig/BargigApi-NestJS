import { Body, Controller, Post, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import { UsersService } from './users.service';
import { CurrentUser } from '../models/current.user';
import { Response, Request } from 'express';
import { authCookies } from '../config/auth';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) {
    }

    @Post('registration')
    async registerUser(@Body() reg: RegistrationReqModel) {
        return await this.userService.registerUser(reg);
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
        const token = await this.userService.getJwtToken(req.user as CurrentUser);
        const refreshToken = await this.userService.getRefreshToken(
            req.user.userId
        )
        const secretData = {
            token,
            refreshToken,
        };
        res.cookie(authCookies.authCookie, secretData, {
            httpOnly: true,
            // domain: 'http://localhost:4200', // your domain here!
            // expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        });
        return { msg: 'success' };
    }

    @Get('fav-movies')
    @UseGuards(AuthGuard('jwt'))
    async movies(@Req() req) {
        return ["Avatar", "Avengers"];
    }

    @Get('refresh-tokens')
    @UseGuards(AuthGuard('refresh'))
    async regenerateTokens(
        @Req() req,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.userService.getJwtToken(req.user as CurrentUser);
        const refreshToken = await this.userService.getRefreshToken(
            req.user.userId,
        );
        const secretData = {
            token,
            refreshToken,
        };
        res.cookie(authCookies.authCookie, secretData, {
            httpOnly: true,
            // domain: 'http://localhost:4200', // your domain here!
            // expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        });
        return { msg: 'success' };
    }

    @Post('code')
    @UseGuards(AuthGuard('local'))
    async code(
        @Req() req,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.userService.getJwtToken(req.user as CurrentUser);
        const refreshToken = await this.userService.getRefreshToken(
            req.user.userId,
        );
        const secretData = {
            token,
            refreshToken,
        };
        res.cookie(authCookies.authCookie, secretData, {
            httpOnly: true,
            // domain: 'http://localhost:4200', // your domain here!
            // expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        });
        res.redirect(`http://localhost:4200/oauth-callback?code=${token}`);
    }

    // @Post('token')
    // // @UseGuards(AuthGuard('jwt'))
    // async token(
    //     @Req() req,
    //     @Res({ passthrough: true }) res: Response
    // ) {
    //     const token = req.body.token;
    //     const refreshToken = await this.userService.getRefreshToken(
    //         2
    //     )
    //     const secretData = {
    //         token,
    //         refreshToken,
    //     };
    //     console.log("token-cookies", secretData)
    //     res.cookie(authCookies.authCookie, secretData, {
    //         httpOnly: true,
    //         // domain: 'http://localhost:4200', // your domain here!
    //         // expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
    //     });
    //     return { msg: 'success' };
    // }
}