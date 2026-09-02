import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { collectErrors } from './format';

export async function validateForm<T extends object>(
  cls: new () => T,
  body: Record<string, unknown>,
): Promise<{ dto: T; errors: Record<string, string> }> {
  const dto = plainToInstance(cls, body);
  const result = await validate(dto as object, {
    whitelist: true,
    forbidNonWhitelisted: false,
  });
  return { dto, errors: collectErrors(result) };
}
