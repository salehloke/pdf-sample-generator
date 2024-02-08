import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('PDF Sample Generator')
    .setDescription('Building Sample data for AI Trainings')
    .setVersion('1.0')
    .addTag('PDF')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('Swagger hosted at:', 'localhost:3000/api')
  await app.listen(3000);
}
bootstrap();
