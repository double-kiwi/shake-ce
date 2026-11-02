import type { PluginContext } from "./plugin-context"

export interface CePlugin {
    id: string

    register(ctx: PluginContext): void
}