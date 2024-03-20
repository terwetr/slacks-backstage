import { getVoidLogger } from '@backstage/backend-common';
import { Writable } from 'stream';
import * as fs from 'fs-extra';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createFileReplaceAction } from './fileReplace';

describe('acme:file:replace', () => {
  const logStream = {
    write: jest.fn(),
  } as jest.Mocked<Partial<Writable>> as jest.Mocked<Writable>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const mockContext = {
    input: {},
    baseUrl: 'somebase',
    workspacePath,
    logger: getVoidLogger(),
    logStream,
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
  };

  const action = createFileReplaceAction();

  beforeEach(() => {
    mockDir.setContent({
      [`${mockContext.workspacePath}/README.md`]:
        'This should stay. <!-- REMOVE start -->This should be removed...<!-- REMOVE end --> This should also stay.',
      [`${mockContext.workspacePath}/my-file`]: 'I picked apples for pie',
    });
    jest.resetAllMocks();
  });

  it('should throw missing pattern error', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          path: 'my-file',
          pattern: '',
        },
      }),
    ).rejects.toThrow('Missing pattern');
  });

  it('should replace "apples" with "peaches"', async () => {
    await action.handler({
      ...mockContext,
      input: {
        path: 'my-file',
        pattern: 'apples',
        replaceWith: 'peaches',
      },
    });

    const content = await fs.readFile(`${workspacePath}/my-file`, 'utf-8');
    expect(content).toBe('I picked peaches for pie');
  });

  it('should replace "<!-- REMOVE -->" block with ""', async () => {
    await action.handler({
      ...mockContext,
      input: {
        path: 'README.md',
        pattern: '<!-- REMOVE start -->[\\s\\S]*<!-- REMOVE end --> ',
        replaceWith: '',
      },
    });

    const content = await fs.readFile(`${workspacePath}/README.md`, 'utf-8');
    expect(content).toBe(`This should stay. This should also stay.`);
  });
});
