import { getVoidLogger } from '@backstage/backend-common';
import { Writable } from 'stream';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createFileListAction } from './fileList';

describe('acme:fs:list', () => {
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

  const action = createFileListAction();

  beforeEach(() => {
    mockDir.setContent({
      [`${mockContext.workspacePath}/README.md`]: '',
      [`${mockContext.workspacePath}/main/java/com/example/controller/MyClass.java`]:
        '',
      [`${mockContext.workspacePath}/test/java/com/example/controller/MyClassTest.java`]:
        '',
      [`${mockContext.workspacePath}/pom.xml`]: '',
    });
    jest.resetAllMocks();
  });

  it('should output list of all workspace files', async () => {
    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'list',
      expect.arrayContaining([
        expect.stringContaining('README.md'),
        expect.stringContaining('MyClass.java'),
        expect.stringContaining('MyClassTest.java'),
        expect.stringContaining('pom.xml'),
      ]),
    );
  });

  it('should output list of filtered (*.java) workspace files', async () => {
    await action.handler({
      ...mockContext,
      input: {
        filter: '.java$',
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'list',
      expect.arrayContaining([
        expect.stringContaining('MyClass.java'),
        expect.stringContaining('MyClassTest.java'),
      ]),
    );
  });
});
