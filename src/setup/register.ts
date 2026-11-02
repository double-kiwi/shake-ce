import { MenuPlugin } from "@/plugins/menu-plugin.ts";
import {
  DEFAULT_LAYOUT_ID,
  PREDEFINED_LAYOUTS,
} from "./../core/predefined-layouts.ts";
import { widgetRegistry, pluginManager, layoutRegistry } from "./../core/runtime.ts";

export function register(): void {
    const context = {
        widgets: widgetRegistry,
        layouts: layoutRegistry
    }

    pluginManager.register(
        new MenuPlugin()
    )

    pluginManager.initialize(context)

    for (const layout of PREDEFINED_LAYOUTS) {
        layoutRegistry.register(layout)
    }

    layoutRegistry.activate(DEFAULT_LAYOUT_ID)
}
