import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class ConfigurationHandler {
  @IsString()
  readonly repositoryUrl: string;

  @IsString()
  readonly ref: string;

  @IsString()
  readonly scriptPath: string;
}

export class Configuration {
  @ValidateNested()
  @IsArray()
  @Type(() => ConfigurationHandler)
  readonly handlers: ConfigurationHandler[];

  findHandler(data: {
    repositoryUrl: string;
    ref: string;
  }): ConfigurationHandler | undefined {
    return this.handlers.find(
      (handler) =>
        handler.repositoryUrl === data.repositoryUrl &&
        handler.ref === data.ref,
    );
  }
}
