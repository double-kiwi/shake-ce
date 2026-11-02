export interface WidgetDefinition {
    id: string
    slot: string
    tagName: string
    data?: any
}

export class WidgetRegistry {
    private widgets: WidgetDefinition[] = []

    register(widget: WidgetDefinition) {
        this.widgets.push(widget)
    }

    getBySlot(slot: string) {
        return this.widgets.filter(w => w.slot === slot)
    }

    getSlots(): string[] {
        return [...new Set(this.widgets.map(x => x.slot))];
    }
}
