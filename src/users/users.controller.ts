import { Body, Controller, Post, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import { UsersService } from './users.service';
import { CurrentUser } from '../models/current.user';
import { Response } from "express";

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
        res.cookie('auth-cookie', secretData, { httpOnly: true, });
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

        res.cookie('auth-cookie', secretData, { httpOnly: true });
        return { msg: 'success' };
    }

    @Post('code')
    async code(@Req() req, @Res() res: Response) {
        const authCode = new Array(10).fill(null).map(() => Math.floor(Math.random() * 10)).join('');
        console.log(req.body)
        // this.authCodes.add(authCode);
        res.redirect(`http://localhost:4200/oauth-callback?code=${authCode}`);
    }

    @Post('token')
    async token(@Req() req, @Res() res: Response) {
        console.log(req.body)
        // Generate a string of 50 random digits
        const token = new Array(50).fill(null).map(() => Math.floor(Math.random() * 10)).join('');
        res.json({ 'access_token': token, 'expires_in': 60 * 60 * 24 });
    }

    // Endpoint secured by auth token
    @Get('secure')
    async secure(@Req() req, @Res() res: Response) {
        return res.json({ answer: 42 });
    }
}