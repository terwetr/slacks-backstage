import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import { readFile, writeFile } from 'fs-extra';
import z from 'zod';

export const createFileReplaceAction = () => {
  return createTemplateAction({
    id: 'acme:file:replace',
    supportsDryRun: true,
    schema: {
      input: z.object({
        path: z.string().describe('The path of the file to be read'),
        pattern: z.string().describe('Regular expression pattern to find'),
        replaceWith: z.optional(z.string()).describe('Replacement value'),
      }),
    },
    async handler(ctx) {
      if (!ctx.input.pattern) {
        throw new InputError('Missing pattern');
      }
      const content = await readFile(
        `${ctx.workspacePath}/${ctx.input.path}`,
        'utf-8',
      );
      await writeFile(
        `${ctx.workspacePath}/${ctx.input.path}`,
        content.replaceAll(
          new RegExp(ctx.input.pattern, 'g'),
          ctx.input.replaceWith ?? '',
        ),
      );
    },
  });
};
