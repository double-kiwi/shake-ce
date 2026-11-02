let apiBaseUrl: string | null = null

/** Default path template; `{id}` is replaced with the preset id. */
export const DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE = '/presets/{id}/bundle'

export function setApiBaseUrl(url: string): void {
  apiBaseUrl = url.replace(/\/$/, '')
}

export function getApiBaseUrl(): string {
  if (apiBaseUrl) return apiBaseUrl
  const fromEnv = import.meta.env.VITE_API_URL
  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '')
  }
  return 'http://localhost:3000'
}

export function buildPresetBundlePath(
  presetId: string,
  template: string = DEFAULT_PRESET_BUNDLE_PATH_TEMPLATE,
): string {
  if (!template.includes('{id}')) {
    throw new Error('presetBundlePathTemplate must include "{id}"')
  }
  return template.replace(/\{id\}/g, encodeURIComponent(presetId))
}

