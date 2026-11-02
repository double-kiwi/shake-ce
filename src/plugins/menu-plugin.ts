import type { CePlugin } from "@/core/ce-plugin"
import type { PluginContext } from "@/core/plugin-context"

export class MenuPlugin implements CePlugin {
  id = "menu"

  register(ctx: PluginContext) {
    ctx.widgets.register({
      id: "menu-widget",
      slot: "sidebar",
      tagName: "menu-widget",
    })
  }
}
