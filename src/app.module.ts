import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurationLoader } from './infrastructure/configuration-loader';
import { Configuration } from './model/configuration';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Configuration,
      useFactory: () => configurationLoader(),
    },
  ],
})
export class AppModule {}
