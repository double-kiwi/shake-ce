import MenuWidget from "@/widgets/MenuWidget.vue";
import ColumnUi from "@/custom/ColumnUi.vue";
import HeaderUi from "@/custom/HeaderUi.vue";
import TileUi from "@/custom/TileUi.vue";
import GridUi from "@/custom/GridUi.vue";
import InputBoxUi from "@/custom/InputBoxUi.vue";

import { defineCustomElement } from "vue";
import {
  DEFAULT_COLUMN_UI_TAG,
  DEFAULT_GRID_UI_TAG,
  DEFAULT_HEADER_UI_TAG,
  DEFAULT_INPUT_BOX_UI_TAG,
  DEFAULT_TILE_UI_TAG,
} from "@/core/presentation-registry";

function defineOnce(tag: string, element: CustomElementConstructor): void {
    if (!customElements.get(tag)) {
        customElements.define(tag, element);
    }
}

export function define(): void {
    defineOnce('menu-widget', defineCustomElement(MenuWidget));

    // Default presentation CEs — skipped when a design lib already registered
    // the same tags (load design before Shake, or pass uiElements on mount).
    defineOnce(DEFAULT_TILE_UI_TAG, defineCustomElement(TileUi));
    defineOnce(DEFAULT_HEADER_UI_TAG, defineCustomElement(HeaderUi));
    defineOnce(DEFAULT_INPUT_BOX_UI_TAG, defineCustomElement(InputBoxUi));
    defineOnce(DEFAULT_GRID_UI_TAG, defineCustomElement(GridUi));
    defineOnce(DEFAULT_COLUMN_UI_TAG, defineCustomElement(ColumnUi));
}
