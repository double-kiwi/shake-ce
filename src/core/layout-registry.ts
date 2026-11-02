import type { LayoutDefinition } from "./layout-definition"

export function style(layout?: LayoutDefinition) {
    if (!layout) {
        return {};
    }

    return {
        display: 'grid',
        gridTemplateColumns: layout.columns,
        gridTemplateRows: layout.rows,
        gridTemplateAreas: layout.gridTemplateAreas.map(x => `"${x}"`).join(" "),
    }
}

export class LayoutRegistry {
    private layouts = new Map<string, LayoutDefinition>()

    private activeLayout = 'default'

    register(layout: LayoutDefinition) {
        this.layouts.set(layout.id, layout)
    }

    has(id: string): boolean {
        return this.layouts.has(id)
    }

    activate(id: string) {
        if (!this.layouts.has(id)) {
            throw new Error(
                `Unknown layout "${id}". Registered: ${[...this.layouts.keys()].join(', ') || '(none)'}`,
            )
        }
        this.activeLayout = id
    }

    getActive() {
        return this.layouts.get(this.activeLayout)
    }
}
