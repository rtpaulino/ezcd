import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Webhooks } from '@octokit/webhooks';
import { ok } from 'assert';

@Injectable()
export class GithubGuard implements CanActivate {
  private readonly webhooks: Webhooks;

  constructor() {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    ok(secret, 'GITHUB_WEBHOOK_SECRET required but not set');

    this.webhooks = new Webhooks({
      secret,
    });
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    request.rawBody.toString();

    const signature = request.headers['x-hub-signature-256'];

    const rawBody = request.rawBody.toString('utf-8');

    return await this.webhooks.verify(rawBody, signature);
  }
}
