import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      password: 'admin',
      database: 'nestjs',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public', 'oauth-dialog'),
      serveRoot: '/oauth-dialog'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
