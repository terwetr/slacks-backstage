import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import z from 'zod';

export const createValueSetAction = () => {
  return createTemplateAction<{
    value: any;
  }>({
    id: 'acme:value:set',
    schema: {
      input: z.object({
        value: z.any().describe('The value to set'),
      }),
      output: z.object({
        value: z.any().describe('Set value'),
      }),
    },
    async handler(ctx) {
      ctx.output('value', ctx.input.value);
    },
  });
};
