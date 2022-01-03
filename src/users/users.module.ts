import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';
// code hidden for disply purpose
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: '123456',
      signOptions: {
        expiresIn: '5m',
      },
    }),
    PassportModule
  ],
  providers: [
    UsersService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy
  ],
  controllers: [UsersController]
})
export class UsersModule { }