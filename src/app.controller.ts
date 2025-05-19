import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { PushEvent, WebhookEvent } from '@octokit/webhooks-types';
import { AppService } from './app.service';
import { GithubGuard } from './auth/github.guard';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @UseGuards(GithubGuard)
  @HttpCode(202)
  @Post('/github/webhook')
  processGithubWebhook(
    @Headers('x-github-event') gitHubEvent: string,
    @Body() body: WebhookEvent,
  ) {
    if (gitHubEvent === 'ping') {
      return;
    } else if (gitHubEvent === 'push') {
      this.appService.processPushEvent(body as PushEvent).catch((error) => {
        this.logger.error('Error processing push event', error.stack);
      });
    } else {
      this.logger.warn(`Unknown event type: ${gitHubEvent}. Ignoring it.`);
    }
  }
}
