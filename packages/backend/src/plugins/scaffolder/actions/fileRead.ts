import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { readFile } from 'fs-extra';
import z from 'zod';

export const createFileReadAction = () => {
  return createTemplateAction<{
    path: string;
    encode: boolean;
    preview: boolean;
  }>({
    id: 'acme:file:read',
    schema: {
      input: z.object({
        path: z.string().describe('The path of the file to be read'),
        encode: z.optional(z.boolean()).describe('Encode as Base64 content'),
        preview: z
          .optional(z.boolean())
          .describe('Preview the file contents in log'),
      }),
      output: z.object({
        content: z.string().describe('The contents of the file'),
      }),
    },
    async handler(ctx) {
      const content = await readFile(`${ctx.workspacePath}/${ctx.input.path}`, {
        encoding: ctx.input.encode ? 'base64' : 'utf-8',
      });

      if (ctx.input.preview) {
        ctx.logStream.write(content);
      }

      ctx.output('content', content);
    },
  });
};
