import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import { RegistrationResModel } from 'src/models/registration.res.model';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './user';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from '../models/current.user';
import { JwtService } from '@nestjs/jwt';
import * as randomToken from 'rand-token';
import * as moment from 'moment';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private user: Repository<User>,
        private jwtService: JwtService
    ) { }

    public async getJwtToken(user: CurrentUser): Promise<string> {
        const payload = {
            ...user
        }
        return this.jwtService.signAsync(payload);
    }

    private async registrationValidation(regModel: RegistrationReqModel): Promise<string> {
        if (!regModel.email) {
            return "Email can't be empty";
        }

        const emailRule =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRule.test(regModel.email.toLowerCase())) {
            return 'Invalid email';
        }

        const user = await this.user.findOne({ email: regModel.email });
        if (user != null && user.email) {
            return 'Email already exist';
        }

        if (regModel.password !== regModel.confirmPassword) {
            return 'Confirm password not matching';
        }
        return '';
    }

    private async getPasswordHash(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    public async registerUser(
        regModel: RegistrationReqModel,
    ): Promise<RegistrationResModel> {
        const result = new RegistrationResModel();

        const errorMessage = await this.registrationValidation(regModel);
        if (errorMessage) {
            result.message = errorMessage;
            result.successStatus = false;

            return result;
        }

        const newUser = new User();
        newUser.firstName = regModel.firstName;
        newUser.lastName = regModel.lastName;
        newUser.email = regModel.email;
        newUser.password = await this.getPasswordHash(regModel.password);

        await this.user.insert(newUser);
        result.successStatus = true;
        result.message = 'success';
        return result;
    }

    public async validateUserCredentials(email: string, password: string): Promise<CurrentUser> {
        const user = await this.user.findOne({ email: email });
        if (user == null) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return null;
        }

        const currentUser = new CurrentUser();
        currentUser.userId = user.userId;
        currentUser.firstName = user.firstName;
        currentUser.lastName = user.lastName;
        currentUser.email = user.email;
        return currentUser;
    }

    public async getRefreshToken(userId: number): Promise<string> {
        const userDataToUpdate = {
            refreshToken: randomToken.generate(16),
            refreshTokenExp: moment().add(14, 'days').format('YYYY/MM/DD'),
        };
        await this.user.update(userId, userDataToUpdate);
        return userDataToUpdate.refreshToken;
    }

    public async validateRefreshToken(email: string, refreshToken: string): Promise<CurrentUser> {
        const currentDate = moment().format("YYYY/MM/DD");
        const user = await this.user.findOne({
            where:
            {
                email: email,
                refreshToken: refreshToken,
                refreshTokenExp: MoreThanOrEqual(currentDate),
            }
        });
        // (async () => {
        //     const user = await this.user.find()
        //     // console.log(user)
        //     // debugger
        // })()
        // console.log(user, currentDate, refreshToken, email)
        // debugger
        if (!user) {
            return null;
        }
        const currentUser = new CurrentUser();
        currentUser.email = user.email;
        currentUser.firstName = user.firstName;
        currentUser.lastName = user.lastName;
        currentUser.userId = user.userId;
        return currentUser
    }
}