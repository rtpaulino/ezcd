import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { setupOpenAPI } from './infrastructure/nestjs/openapi';
import { setupValidation } from './infrastructure/nestjs/validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  await setupOpenAPI(app);
  setupValidation(app);

  app.use(morgan('common'));

  await app.listen(process.env.PORT ?? 4444);
}

void (async () => {
  await bootstrap();
})();
