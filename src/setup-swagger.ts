import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Base api project')
    .setDescription('## description will be update later')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.info(`documentation: http://localhost:${process.env.PORT}/documentation`);
}
