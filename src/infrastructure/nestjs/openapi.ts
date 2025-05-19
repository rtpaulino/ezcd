import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import metadata from 'src/metadata';

export async function setupOpenAPI(app: INestApplication) {
  const openAPIConfig = new DocumentBuilder()
    .setTitle('EZCD')
    .setDescription('Easy Continuous Delivery')
    .setVersion('0.0.1')
    .build();

  await SwaggerModule.loadPluginMetadata(metadata);

  const documentFactory = () =>
    SwaggerModule.createDocument(app, openAPIConfig);

  SwaggerModule.setup('spec', app, documentFactory, {
    swaggerUiEnabled: true,
  });
}
