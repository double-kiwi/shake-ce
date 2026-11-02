import type { LayoutRegistry } from "./layout-registry";
import type { WidgetRegistry } from "./widget-registry";

export interface PluginContext {
    widgets: WidgetRegistry
    layouts: LayoutRegistry
}
