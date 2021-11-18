import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, ExpressSwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Bargig Api')
    .setDescription('The base Nest Api')
    .setVersion('1.0')
    // .addBasicAuth(
    //   {
    //     type: 'http',
    //     name: 'User Credential',
    //     description: 'Enter Id And PhoneNumber',
    //     in: 'header',
    //   },
    //   // 'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    //   'user-credential',
    // )
    // .addApiKey()
    // .addOAuth2()
    // .addCookieAuth()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      // 'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerCustomOptions: ExpressSwaggerCustomOptions = {
    customSiteTitle: 'Bargig Api',
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
    customfavIcon: 'https://firebasestorage.googleapis.com/v0/b/morbargig-a81d2.appspot.com/o/smallMorBargigSig.png?alt=media'
  }

  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();
