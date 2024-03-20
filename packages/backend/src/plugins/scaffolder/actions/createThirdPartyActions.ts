import {
  createWriteFileAction,
  createAppendFileAction,
  createParseFileAction,
  createReplaceInFileAction,
  createJSONataAction,
  createYamlJSONataTransformAction,
  createJsonJSONataTransformAction,
  createMergeJSONAction,
  createMergeAction,
  createSerializeJsonAction,
  createSerializeYamlAction,
  createSleepAction,
  createZipAction,
} from '@roadiehq/scaffolder-backend-module-utils';
import { createHttpBackstageAction } from '@roadiehq/scaffolder-backend-module-http-request';
import { DiscoveryService } from '@backstage/backend-plugin-api';

export const createThirdPartyActions: any = (
  discovery: DiscoveryService,
  actionId?: string,
) => [
  createWriteFileAction(),
  createAppendFileAction(),
  createParseFileAction(),
  createReplaceInFileAction(),
  createJSONataAction(),
  createYamlJSONataTransformAction(),
  createJsonJSONataTransformAction(),
  createMergeJSONAction({ actionId }),
  createMergeAction(),
  createSerializeJsonAction(),
  createSerializeYamlAction(),
  createSleepAction(),
  createZipAction(),
  createHttpBackstageAction({ discovery }),
];
