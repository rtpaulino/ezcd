import { Inject, Injectable, Logger } from '@nestjs/common';
import type { PushEvent } from '@octokit/webhooks-types';
import { ok } from 'node:assert';
import { spawn } from 'node:child_process';
import { Configuration } from './model/configuration';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(Configuration) private readonly configuration: Configuration,
  ) {}

  async processPushEvent(event: PushEvent): Promise<void> {
    const handler = this.configuration.findHandler({
      repositoryUrl: event.repository.html_url,
      ref: event.ref,
    });

    if (handler) {
      await this.executeScript(handler.scriptPath);
    } else {
      this.logger.warn(
        `No handler found for repository ${event.repository.html_url} and ref ${event.ref}. Ignoring the event.`,
      );
    }
  }

  async executeScript(scriptPath: string): Promise<void> {
    this.logger.log(`Executing script: ${scriptPath}`);

    return new Promise<void>((resolve, reject) => {
      try {
        const process = spawn(scriptPath, [], {
          stdio: 'inherit',
          shell: true,
        });

        process.on('close', (code) => {
          if (code === 0) {
            this.logger.log(`Script executed successfully: ${scriptPath}`);
            resolve();
          } else {
            const error = new Error(
              `Script execution failed with code ${code}: ${scriptPath}`,
            );
            reject(error);
          }
        });

        process.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        ok(error instanceof Error, 'Error should be an instance of Error');
        reject(error);
      }
    });
  }
}
