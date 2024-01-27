import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { readFile, writeFile } from 'fs-extra';
import jsonata from 'jsonata';
import yaml from 'js-yaml';
import z from 'zod';
import { InputError } from '@backstage/errors';

export const createFileDeleteKeyAction = () => {
  return createTemplateAction({
    id: 'acme:file:deleteKey',
    schema: {
      input: z.object({
        filename: z.string().describe('Filename of YAML file to transform'),
        location: z
          .string()
          .describe(
            'Location path, beginning at root, from which to remove key(s)',
          ),
        keys: z.array(z.string()).describe('Array of key names'),
      }),
    },
    async handler(ctx) {
      if (!ctx.input.location) {
        throw new InputError('Missing location');
      }
      if (!ctx.input.keys) {
        throw new InputError('Missing key(s)');
      }
      const content = await readFile(
        `${ctx.workspacePath}/${ctx.input.filename}`,
        {
          encoding: 'utf-8',
        },
      );

      const result = await jsonata(
        `$ ~> | ${ctx.input.location} | {}, ["${ctx.input.keys.join('","')}"] |`,
      ).evaluate(yaml.load(content));

      await writeFile(
        `${ctx.workspacePath}/${ctx.input.filename}`,
        yaml.dump(result),
      );
    },
  });
};
