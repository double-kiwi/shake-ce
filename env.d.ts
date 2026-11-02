/// <reference types="vite/client" />

interface Window {
  Shake: {
    mount: (
      id: string,
      options: {
        apiBaseUrl?: string
        presetBundlePathTemplate?: string
        presetId: string
      },
    ) => Promise<void>
    setPresetId: (presetId: string) => Promise<void>
  }
}
