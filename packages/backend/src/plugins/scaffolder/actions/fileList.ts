import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { relative } from 'path';
import { recursiveReadDir } from './log';
import z from 'zod';

export const createFileListAction = () => {
  return createTemplateAction<{ filter?: string }>({
    id: 'acme:file:list',
    description: 'Get list of all files in the workspace.',
    schema: {
      input: z.object({
        filter: z
          .optional(z.string())
          .describe('File filter regular expression pattern'),
      }),
      output: z.object({
        list: z.array(z.string()).describe('List of files'),
      }),
    },
    async handler(ctx) {
      ctx.logger.info(JSON.stringify(ctx.input, null, 2));

      const files = await recursiveReadDir(ctx.workspacePath);
      const filesArr = files
        .map(f => relative(ctx.workspacePath, f))
        .filter(v => new RegExp(ctx.input?.filter || '.*').test(v));

      ctx.logStream.write(`\n${filesArr.join('\n')}`);

      ctx.output('list', filesArr);
    },
  });
};
