import { createFileListAction } from './fileList';
import { createFileReadAction } from './fileRead';
import { createFileReplaceAction } from './fileReplace';
import { createValueSetAction } from './valueSet';

export const createCustomActions = () => [
  createFileListAction(),
  createFileReadAction(),
  createFileReplaceAction(),
  createValueSetAction(),
];
