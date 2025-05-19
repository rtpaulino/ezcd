import { ok } from 'assert';
import { readFile } from 'fs/promises';
import { Configuration } from 'src/model/configuration';
import { parseDto } from 'src/util/dto';

export async function configurationLoader(): Promise<Configuration> {
  const configPath = process.env.CONFIGURATION_PATH;
  ok(configPath, 'CONFIGURATION_PATH required but not set');

  try {
    const raw = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const typed = parseDto(Configuration, parsed);
    return typed;
  } catch (err) {
    throw new Error(`Failed to read configuration file: ${err.stack}`);
  }
}
