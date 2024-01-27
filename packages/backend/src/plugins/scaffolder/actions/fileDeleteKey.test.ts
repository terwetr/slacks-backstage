import { getVoidLogger } from '@backstage/backend-common';
import { Writable } from 'stream';
import * as fs from 'fs-extra';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createFileDeleteKeyAction } from './fileDeleteKey';

describe('acme:file:deleteKey', () => {
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
  };

  const action = createFileDeleteKeyAction();

  beforeEach(() => {
    mockDir.setContent({
      [`${mockContext.workspacePath}/example.yaml`]: `
spring:
  datasource:
    user: guest
    pass: guest
  jpa:
    user: guest
    pass: guest
  domain:
    patient: true
  flyway:
    user: guest
    pass: guest
  other:
    item1:
      sub1: 1
    item2:
      sub2: 2
`,
    });
    jest.resetAllMocks();
  });

  it('should throw missing location error', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          filename: 'example.yaml',
          location: '',
          keys: [],
        },
      }),
    ).rejects.toThrow('Missing location');
  });

  it('should delete spring[jpa|flyway] keys', async () => {
    await action.handler({
      ...mockContext,
      input: {
        filename: 'example.yaml',
        location: 'spring',
        keys: ['jpa', 'flyway'],
      },
    });

    const content = await fs.readFile(`${workspacePath}/example.yaml`, 'utf-8');
    expect(content).toContain('domain');
    expect(content).not.toContain('jpa');
    expect(content).not.toContain('flyway');
  });

  it('should delete spring.other[item1] keys', async () => {
    await action.handler({
      ...mockContext,
      input: {
        filename: 'example.yaml',
        location: 'spring.other',
        keys: ['item1'],
      },
    });

    const content = await fs.readFile(`${workspacePath}/example.yaml`, 'utf-8');
    expect(content).toContain('item2');
    expect(content).not.toContain('item1');
  });
});
