import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, ExpressSwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule
    , {
      // bodyParser: true,
      cors: {
        origin: 'http://localhost:4200',
        credentials: true,
      }
    }
  );

  const config = new DocumentBuilder()
    .setTitle('Bargig Api')
    .setDescription('The base Nest Api')
    .setVersion('1.0')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'JWT',
    //     description: 'Enter JWT token',
    //     in: 'header',
    //   },
    //   // 'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    //   'access-token',
    // )
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
  app.enableCors(
    {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    }
  );
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  SwaggerModule.setup('api', app, document, swaggerCustomOptions);
  const PORT = 3000
  console.log(`app running on port ${PORT}`)
  await app.listen(3000);
}
bootstrap();
