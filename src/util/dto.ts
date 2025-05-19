import { Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

// TODO: share same configuration with NestJS

export function parseDto<T extends object>(
  classType: Type<T>,
  data: unknown,
): T {
  const result = plainToInstance(classType, data, {
    excludePrefixes: ['_'],
    enableImplicitConversion: false,
  });

  const errors = validateSync(result, {
    whitelist: true,
    skipMissingProperties: false,
  });

  // TODO: make sure this message is good (or reuse NestJS message)
  if (errors.length > 0) {
    const errorMessages = errors.map((error) => `- ${error.toString()}`);
    throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
  }

  return result;
}
