# Shake CE

`@shake/ce` is the embeddable Shake configurator. A host page mounts it, it loads one preset bundle, and it renders that preset's menu. Choosing a tile or editing an input box updates the selection and re-evaluates which nodes are visible and enabled.

The package is private. Use it from a host page or from the library build, not as a published app of its own.

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`
- Yarn (`yarn.lock` is the lockfile)

## Scripts

| Command | What it does |
| --- | --- |
| `yarn` | Install dependencies |
| `yarn dev` | Vite dev server. `index.html` mounts preset `6` against the Vite origin. `vite-plugin-mock` serves `GET /presets/:id/bundle` in dev only. |
| `yarn test:unit` | Vitest in jsdom |
| `yarn type-check` | `vue-tsc --build` |
| `yarn lint` | oxlint, then ESLint (`--cache`) |
| `yarn format` | Prettier on `src/` |
| `yarn build` | Type-check, then the IIFE bundle and the ESM library |
| `yarn preview` | Preview the Vite build |

## Host page

In development the page imports the source entry:

```html
<div id="configurator" style="height: 600px"></div>
<script type="module">
  import { mount } from '/src/main.ts'

  mount('configurator', {
    apiBaseUrl: window.location.origin,
    presetBundlePathTemplate: '/presets/{id}/bundle',
    presetId: '6',
  }).catch((err) => console.error(err))
</script>
```

A production host loads the IIFE. Vite exposes it as `Shake`:

```html
<div id="configurator" style="height: 600px"></div>
<script src="/shake.js"></script>
<script>
  Shake.mount('configurator', {
    apiBaseUrl: 'http://localhost:3000',
    presetBundlePathTemplate: '/presets/{id}/bundle',
    presetId: '1',
    layout: 'menu',
  }).catch((err) => console.error(err))

  // later, without remounting:
  // await Shake.setPresetId('2')
</script>
```

`mount` replaces the children of `#configurator` with `<shake-app>`. Set a height on that host element. The shell inside the element is `height: 100%`, and the custom element itself stays inline unless the host styles it (`display: block; height: 100%`).

### Mount options

| Option | Required | Role |
| --- | --- | --- |
| `presetId` | yes | Preset id, as a string. `{id}` in the path is URL-encoded. |
| `apiBaseUrl` | no | Backend origin, trailing slash stripped. Falls back to `VITE_API_URL`, then `http://localhost:3000`. |
| `presetBundlePathTemplate` | no | Path relative to the origin. Must contain `{id}`. Default `/presets/{id}/bundle`. |
| `layout` | no | `dashboard` (default), `dashboard-left`, `split`, `stacked`, or `menu`. Applied before `<shake-app>` is created. |
| `uiElements` | no | Tag names for tile, header, input box, grid, and column. Defaults: `tile-ui-ce`, `header-ui-ce`, `input-box-ui-ce`, `grid-ui-ce`, `column-ui-ce`. |
| `renderer` | no | Renderer kit. When set, it replaces the custom-element kit built from `uiElements`. |

`setPresetId(id)` refetches that bundle, replaces the selection map with the new defaults, and re-evaluates the tree.

Pass `layout`, `uiElements`, and `renderer` on `mount`. The shell and the menu read them once, when `<shake-app>` is created.

## Runtime

Importing `src/main.ts` registers the menu plugin, subscribes to `conf:adjust`, defines custom elements, and creates one Pinia instance.

1. `mount` stores the API origin and path template, activates the layout, and inserts `<shake-app>`.
2. The client requests `GET {apiBaseUrl}{template}`. The body is `{ preset, document, defaults }`.
3. `defaults` (`Record<string, string[]>`) hydrate the configuration store.
4. The published tree becomes menu nodes. Catalog slug `box` is mapped to `input-box`. Each `LogicExpr` becomes `isVisible` and `isEnabled`. `null` means visible and enabled.
5. `MenuWidget` renders the evaluated tree. Hidden children are omitted. The default kit draws each kind with a presentation custom element.
6. A tile emits `conf:adjust` with `replace`, `toggle`, or `append` (from the tile `fill`, default `replace`). An input box replaces that property with the new string, or clears it. The preset store then re-evaluates the tree.

The menu plugin registers a single `menu-widget` in the `sidebar` slot. `header` and `content` in the built-in grids stay empty until another plugin registers a widget there. `menu` is the layout that matches the current widget.

`define()` skips a tag that `customElements` already has. Load a design library before this module, or pass `uiElements` / `renderer`, to replace the default chrome.

There is one runtime per page. A second `<shake-app>` shares the preset, the selection, the layout, and the renderer kit.

The fetch client sends no auth header. `fetch` uses default credentials, so a cross-origin bundle call is anonymous. The endpoint needs to allow the host origin.

## Build outputs

| Script | Output | Consumer |
| --- | --- | --- |
| `yarn build:iife` | `dist/shake.js` | Host `<script>`. Vue, Pinia, and mitt are bundled. Global name `Shake`. |
| `yarn build:lib` | `dist/lib/main.js` and `dist/lib/src/main.d.ts` | ESM `import`. `vue`, `pinia`, and `mitt` stay external. |

`package.json` `exports` points at the library build. `files` publishes `dist` only.

## Layout of the source

```
src/main.ts                 mount and setPresetId
src/api/                    fetch client, path template, bundle types
src/stores/                 preset bundle and selection map
src/helpers/menu/           document adapter and LogicExpr
src/setup/                  plugin registration, custom elements, conf:adjust
src/widgets/MenuWidget.vue  loading, error, and the menu tree
src/components/             slot shell and tree renderer
src/headless/               tile and input-box behavior
src/render/                 renderer kits and custom-element adapter
src/custom/                 default presentation elements
src/core/                   plugins, layouts, registries, event bus
src/__tests__/              Vitest unit tests
mock/presets.ts             dev bundle for vite-plugin-mock
doc/preset-integration.md   preset contract notes
```

## Tests

`yarn test:unit` covers the path template, configuration updates, `LogicExpr` for `selected`, the document adapter, the menu model, tile and input-box controllers, both registries, the custom-element kit, and the tree renderer.

Still untested: the preset store (including overlapping loads), the HTTP client, `mount` / `setPresetId`, the app shell, and the `conf:adjust` subscription.

## Design note

[`doc/preset-integration.md`](doc/preset-integration.md) describes the preset bundle, the two stores, and `LogicExpr`. It still uses monorepo paths (`apps/ce`, sibling backend docs). Its mount example lists `apiBaseUrl`, `presetBundlePathTemplate`, and `presetId`. The implementation in `src/main.ts` also accepts `layout`, `uiElements`, and `renderer`, and `mount` returns a promise.
