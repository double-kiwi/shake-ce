import type { CePlugin } from "./ce-plugin"
import type { PluginContext } from "./plugin-context"

export class PluginManager {
    private plugins: CePlugin[] = []

    register(plugin: CePlugin) {
        this.plugins.push(plugin)
    }

    initialize(ctx: PluginContext) {
        this.plugins.forEach(plugin => {
            plugin.register(ctx)
        })
    }
}