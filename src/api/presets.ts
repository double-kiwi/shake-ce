import { api } from './client';
import {
  buildPresetBundlePath,
  DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE,
} from './config';
import type { PresetBundle } from './types';

export const presetsService = {
  getBundle: (
    presetId: string,
    pathTemplate: string = DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE,
  ) =>
    api.get<PresetBundle>(buildPresetBundlePath(presetId, pathTemplate)),
};
