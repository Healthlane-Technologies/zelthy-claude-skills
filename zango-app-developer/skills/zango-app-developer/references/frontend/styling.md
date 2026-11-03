# Styling Zango CRUD UIs

**Package:** `@zango-core/crud` 2.1.x · `@zango-core/components` 1.0.x

This is guidance, not a CSS kit. Part 1 lists what the package lets you theme.
Parts 2 to 4 show how one production app gave its tables a polished look. Read
those values as a reference spec, not as rules.

---

## 1. Theming the package

### How styles load

- The library CSS is bundled into the JS and injected on import. **You do not
  import a stylesheet.**
- The library reads `--color-*` variables at runtime. Define them in any
  global CSS; load order does not matter.
- The library ships **no brand colors**. If `--color-brand-*` is not defined,
  brand surfaces render with no color. The one exception is `--primary`, which
  falls back to `#5048ed`.

### Color scales (supplied by the host app)

| Scale | Variables | Notes |
|---|---|---|
| Brand | `--color-brand-25` … `-950` | Required. Primary buttons, row hover, focus ring, checkbox fill. |
| Gray | `--color-gray-25` … `-950` | Optional. Without it, Tailwind's grays apply (there is no default `25`). |
| Status | `--color-success-*`, `--color-error-*`, `--color-warning-*` | Same steps from 25 to 950. |
| Base | `--color-base-white`, `--color-base-black` | |

In a Zango app the tenant theme serves these at runtime. **Retint by
overriding the variables, never the rules that read them.**

### Semantic tokens

Override one token to retune one surface. Every component that reads it
follows.

| Group | Tokens | Default |
|---|---|---|
| Surfaces | `--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground` (+ `-foreground` pairs) | white / gray-900 / gray-100 / gray-500 |
| Brand | `--primary`, `--accent`, `--accent-foreground` | brand-500 / brand-50 / brand-700 |
| Borders | `--border`, `--input`, `--ring` | `--zango-border-color-subtle` → gray-200; ring brand-500 |
| Radius | `--radius` | `8px`. Opt-in only, through `rounded-[var(--radius)]`. Do **not** define `--radius-sm/md/lg`: those are Tailwind v4 scale tokens. |
| Font | `--zango-font-family` | Inter, then system fallbacks |
| Table | `--table-header-bg`, `--table-header-fg`, `--table-header-border`, `--table-row-border`, `--table-row-hover`, `--table-row-selected`, `--table-cell-fg`, `--table-cell-muted`, `--table-container-border`, `--table-pinned-shadow` | gray-50 / gray-400 / gray-200 / brand-25 / brand-50 / gray-950 |
| Detail view | `--detail-page-bg`, `--detail-card-shadow`, `--detail-menu-shadow` | `#f8f9fb`, near-flat, menu shadow |

A `.dark` class on an ancestor switches the surface, brand and border tokens
to their dark values.

The package defaults are already close to the look in Part 3. The header is
10px, uppercase, semibold, tracked `0.07em`, in `--table-header-fg`. Body
cells are 12.5px with `px-[14px] py-[13px]`.

### Control tokens shared with `@zango-core/components`

| Token | Default | Effect |
|---|---|---|
| `--zango-control-height-sm` / `-md` / `-lg` | 32 / 36 / 44px | Height of buttons, inputs and selects at each size. Setting `-md` also resizes crud form fields. |
| `--zango-control-padding-x-sm/md/lg` | 12 / 16 / 24px | Horizontal padding of controls. |
| `--zango-border-color-subtle` | gray-200 | Every neutral border **at rest**. |
| `--zango-border-color-default` | gray-300 | **Hover only** for fields and outline buttons. |
| `--zango-border-radius-sm/md/lg` | 6 / 8 / 12px | Radii derived from `--radius`. |

> **⚠️ `--zango-border-color-default` is a hover color.** The reference app sets it to
> gray-100 to get faint hairlines. Hovered fields then went *lighter* than at
> rest, which needed a fix-up. For hairlines, use your
> own token or `--zango-border-color-subtle`.

`--form-*` tokens (field height, font, label, date radius) are for forms only.
See `form.md` and the package's `docs/guide/forms.md#theming`. Field height
resolves as `--form-field-height`, then `--zango-control-height-md`, then
`36px`.

### `customClass` / `customStyle`

Use these to style one part of one table. The keys are typed as
`TableCustomClasses` / `TableCustomStyles`. Each `customStyle` key is a
function of state, except `horizontalFilterBar`, which is a plain object.

| Area | Useful keys |
|---|---|
| Frame | `container`, `tableWrapper`, `table` |
| Header bar | `headerContainer`, `headerTitle`, `headerTitleCount`, `headerActions`, `headerAddButton` |
| Columns | `headerRow`, `headerCell`, `headerCellPinned`, `sortButton`, `sortIcon` |
| Rows | `bodyRow`, `bodyRowSelected`, `bodyCell`, `bodyCellPinned`, `emptyStateRow`, `skeletonRow`/`Cell`/`Bar` |
| Toolbar | `utilitiesContainer`, `utilitiesLeft`/`Right`, `searchInput`, `filterButton`, `filterBadge`, `downloadButton`, `columnOptionsButton` |
| Pager | `paginationContainer`, `paginationInfo`, `paginationButton`, `paginationNavButton`, `paginationSelect` |
| Filters | `filterSidebar`, `filterHeader`, `filterTitle`, `filterClearAll`, `filterContent`, `filterAccordion` (the fields grid too), `filterItem`, `horizontalFilterBar` |
| Cells | `statusBadge`, `tagsContainer`, `tag`, `actionsContainer`, `actionButton`, `actionMenuButton` (class only), `workflowButton` |

> **⚠️ Some keys are declared but never read** in 2.1.x source:
> `bodyRowHover`, `paginationButtonActive` and `loadingOverlay`. They do
> nothing. For row hover, use `--table-row-hover`.

> **⚠️ `filterSidebar` cannot change the sidebar width.** It styles the
> filter container *inside* the sidebar. The 268px wrapper is hard-coded in
> `CrudHandler.tsx:330-337`.

**Prefer tokens or CSS over `customClass` when:**

- the change is app-wide (set a token once, not a prop on every table);
- the target is in markup you do not render: crud's own drawers, forms and
  detail panels;
- the rule needs a stateful ancestor, such as `tr:hover td:first-child` or
  `th.is-sorted .sort-ind`.

Use `customClass` for a one-off change on a single `CrudHandler`.

### Tailwind v4 gotchas (verified in the reference app)

| Gotcha | Why | Fix |
|---|---|---|
| Layer order must be the **first rule** in the app's entry CSS: `@layer theme, base, components, utilities;` | Layer precedence follows registration order. Vendor sheets register `components` alone, which puts `components` above `base` and breaks layered margins. | `the reference app/src/index.css:1-4`. Never re-register the list in another file. |
| `bg-brand-*` / `text-brand-*` utilities may produce **no CSS rule** | The app's Tailwind has no `@theme` entry for the brand scale. Only the steps a vendor sheet already emits will resolve. In the reference app, `bg-brand-100` / `text-brand-700` / `border-brand-50` silently failed. | Use arbitrary values, `bg-[var(--color-brand-600)]`, or plain CSS. Check in DevTools that the rule exists. |
| crud's injected CSS is **unlayered** | Unlayered rules beat any layered utility. For example, crud's `hover:` border beat the components package's `focus:border-brand-500`. | Override with unlayered CSS that has equal or higher specificity. |

---

## 2. Filter placement

| Option | How | Notes |
|---|---|---|
| **a. Package sidebar** | `filterLayout="sidebar"` (the default), set as a prop or through metadata `filter_layout` | **Left side only.** 268px wide, with `border-r`. It **starts hidden**: `TableProvider` sets `hideControls` to `true`, so it collapses to `w-0` until the Filters button opens it. Not rendered below 768px. |
| **b. Horizontal bar** | `filterLayout="horizontal"` | Sits under the toolbar and animates its height open. Style it with `customClass.horizontalFilterBar`. |
| **c. Mobile bottom sheet** | Automatic below 768px | `TableUtilities.tsx:460` renders `MobileFilterSheet` (`FilterContainer hideHeader`). |
| **d. Filters on the right** | **Not a package option.** Build it with the hooks (see below). | This is the pattern the reference app uses. |

### Filter variants: `fields` (default) vs `accordion`

`CrudFilters`, `TableFilters`, the sidebar and the mobile sheet all render
`FilterContainer`. Its `variant` prop takes one of two values:

- **`fields`** (the default): every filter is open as a labelled field. There
  is nothing to expand. The fields sit in a grid with columns at least
  `--filter-grid-min` wide (default `100%`, so one column). The gap is
  `--filter-grid-gap` (default `12px 16px`). Set both on an ancestor to get
  several columns.
- **`accordion`**: each filter sits behind a collapsible row. This suits a
  long list in a full-height sidebar.

> The `fields` default lands in the uncommitted 2.1.x change. Installed
> builds that predate it default to `accordion`. Pass `variant="fields"`
> explicitly so the result is the same on every version.

Data hooks for styling (`fields` only):

| Hook | Where |
|---|---|
| `[data-filter-fields]` | The grid. Sizes the fields to `--zango-control-height-md` (34px fallback) with 12px text. |
| `[data-filter-item]`, `[data-filter-key="<key>"]`, `[data-active]` | One field. `data-active` is set when the field holds a value. |
| `[data-filter-label]` | The field label. |
| `[data-flash]` | Set for 1.4s on the field that `focusField` targets. **No CSS ships for it**, so style it yourself. |

`focusField={{ key }}` scrolls to a field, focuses it and flashes it. Pass a
**new object** each time to repeat the focus.

`AppliedFilters` (from `/table` or `/ui`) renders the active filters as chips,
each with its own remove button, plus Clear all. It renders nothing when no
filter is set. Props:

- `hidden`: keys shown somewhere else, such as quick filters. These get no
  chip, and Clear all keeps them.
- `labels`, `formatValue`: change a chip's label or value text.
- `onOpen(key)`: makes the chip text a button.

Its parts carry `data-applied-filters`, `-chip`, `-open`, `-key`, `-value`,
`-remove` and `-clear` for styling.

### Right-side popover: the reference app pattern


| Part | Spec |
|---|---|
| Trigger | An icon-only outline `Button size="md"`, square (`aspect-square px-0`), with a 13px lucide `Filter` icon. It is the **last control** on the toolbar's right, before Download and Add. Set `aria-expanded={open}`, and put the count in `aria-label`. |
| Count badge | Absolute at `-top-1.5 -right-1.5`, `h-4 min-w-4`, rounded-full, 10px semibold, brand-500 background. Mark it `aria-hidden`. |
| Position | `position: fixed` from the trigger's rect: `top = rect.bottom + 6`, `right = innerWidth − rect.right`. Recompute on scroll (capture phase) and on resize. **Do not render until it has been measured.** Otherwise the first open appears to slide in from 0,0. |
| Panel | `width: 340px`, white, 1px gray-200 border, `rounded-[10px]`, `box-shadow: 0 12px 32px -8px rgba(15,18,32,.18)`, `transform-origin: top right`. |
| Body | `max-h-[60vh] overflow-y-auto px-4 pt-1 pb-3`, containing `<CrudFilters hideHeader variant="fields" />`. With `hideHeader` the package adds no padding, so the host must pad. |
| Footer | `border-t border-gray-100 px-3 py-2`. On the left, a **Clear all** button (`variant="link"`), disabled when the count is 0. On the right, **Done** (`outline`, not primary, because filters apply as they change). |
| Stacking | A full-screen backdrop at z 10000 (a click on it closes the popover), and the panel at z 10001. |
| Portal host | `createPortal(…, popoverHost())`. This mounts the popover in the last open `[role="dialog"]`, or in `<body>` when no dialog is open. See Part 4. |

```tsx
const { filterObj } = useTableFilters();          // from @zango-core/crud/table
const count = Object.entries(filterObj).filter(([k, v]) =>
  k !== 'search' && !quickKeys.includes(k) &&
  v != null && v !== '' && !(Array.isArray(v) && v.length === 0)).length;

const [open, setOpen] = useState(false);
const [focus, setFocus] = useState<{ key: string } | null>(null);

<AppliedFilters hidden={quickKeys} onOpen={(key) => { setOpen(true); setFocus({ key }); }} />
// …inside the popover body:
<CrudFilters hideHeader variant="fields" focusField={focus} />
```

Put the `AppliedFilters` row **under the toolbar**. A click on a chip then
opens the popover on that field.

> **⚠️ Delete the old expand-all workaround.** Before `fields` existed, the reference app
> ran `useExpandAllFilters` plus the
> `.crud-filter-panel` accordion CSS.
> These clicked every accordion header open and restyled the headers as
> labels. The workaround existed because a collapsed accordion row carries the
> `inert` attribute: forcing it open with CSS looks right, but the inputs
> cannot be clicked or focused. `variant="fields"` makes all of it
> unnecessary, along with the skeleton gate and the "ready" timer it needed.

---

## 3. Table look: a reference spec

Treat these as reference values, not requirements.

### Toolbar

| Item | Value |
|---|---|
| Container | `px-6 py-[12px]`, `flex items-center gap-2` |
| Order | slot `start` → **search** → slot `beforeTabs` → flex-1 region (status tabs or quick-filter pills, then slot `afterTabs`) → slot `end` → **Filters** → **Download** → **Add** |
| Sizing | Every control at the `md` preset. `TableSearchField inputSize="md"` and `TableDownloadButton size="md"` must be set explicitly, because both **default to `sm`**, which leaves them 4px short. the reference app sets `--zango-control-height-md: 34px`. |
| Download | Icon only: 13px lucide `Download`, `className="aspect-square px-0 justify-center"`. |

### Table card

| Context | Treatment |
|---|---|
| List page | No card. The table runs edge to edge with a white background. The first and last columns pad to **24px** so they line up with the page header's `px-6`. |
| Embedded (detail tab) | `border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(16,24,40,.06), 0 1px 2px rgba(16,24,40,.04)`, and toolbar `padding-block: 24px`. |
| Scroller | A `@container` wrapper with `overflow: auto` and a height of `70vh`. |

### Header row

- `text-[10px] font-semibold uppercase tracking-[0.07em] text-gray-400`;
  padding `11px 16px 10px`.
- Background `--psp-table-header-bg` (gray-50). **Sticky** (`top-0 z-[1]`)
  and opaque.
- Bottom border `--zango-border-color-default` (gray-100 in the reference app).
- Sort carets: lucide `ChevronUp`, `ChevronDown` and `ChevronsUpDown` at
  10-11px, in gray-400. The sorted column's `th` turns gray-900 and **its
  caret turns brand-500**.

### Body cells

| Item | Value |
|---|---|
| Cell | `padding: 14px 16px`, 13px, gray-900, `line-height: 1.4`, `nowrap`, 1px `--zango-border-color-default` bottom border. The last row has no border. |
| Truncation | The cell content gets `max-width: 260px` with an ellipsis. A tooltip shows **only when the text is actually clipped** (`scrollWidth > clientWidth + 1`, tested live on hover). Wrapping renderers opt out (`.col-wrap`). |
| Striping | None. |
| Hover (clickable rows only) | gray-50 background plus `box-shadow: inset 2px 0 0 var(--color-brand-500)` on the first cell. `:active` turns gray-100. |
| Focus | `tr:focus-visible { outline: 2px solid brand-500; outline-offset: -2px }`. Rows get `role="button"` and `tabIndex=0` and respond to Enter and Space. |
| Cell voices | `.cell-primary`: 13px, weight 575 (600), gray-900. `.cell-mono`: JetBrains Mono, 13px, gray-600, `tabular-nums`. |

### States

- **Loading:** 10 skeleton rows, 60px tall, each cell holding a 12px gray-100
  bar with a 6px radius. Show these on the **first** load only. On later
  refetches, keep the previous rows on screen.
- **Empty:** `EmptyState` (Inbox icon) inside
  `<div className="sticky left-0 w-[100cqw]">`, in a `colSpan` cell with
  padding 0. The container query keeps it centered in the **visible** width
  of a wide table.
- **Error:** the same slot, with an AlertTriangle icon, the title "Couldn't
  load records", and a **Retry** button.

### Pager

| Item | Value |
|---|---|
| Footer | `px-6 py-[10px] gap-[14px] text-[13.5px] text-gray-600`, `border-t`, wraps on narrow screens. |
| Count | "Showing **X–Y** of **N**" (numbers weight 575, `tabular-nums`, gray-900). Shows skeleton bars while the first fetch loads, and "0 results" when empty. |
| Page size | Options `10 / 25 / 50 / 100` (`"n / page"`). The list opens **upward**: `dropdownClassName="bottom-full top-auto mt-0 mb-1"`, because the footer would clip it. |
| Buttons | 28×28 minimum, `radius 6px`, 12.5px, weight 530, gray-600. Hover gray-50. **Active page: brand-100 background, brand-700 text** (brand-200 on hover). Chevron prev/next, with ellipses at 1 … 4 5 6 … N. |

### Surrounding chrome

| Piece | Value (file) |
|---|---|
| Page header | Title 20px bold, `tracking-[-.02em]`, gray-900. Optional eyebrow 10px uppercase brand-500. `mb-4`. |
| Stat card | `rounded-[14px] border-gray-100 p-5`, white. Label 11px uppercase `tracking-[.07em]`; value 28px bold `tabular-nums`. |
| Quick-filter pills | A `Segmented` group with a white track and a `--zango-border-color-subtle` border. A solid brand-600 thumb slides under the chosen option (transform and width, `--psp-dur-3`). The pills fall back to dropdowns when they do not fit. |
| Form drawer | `Drawer position="right" size="lg"` (640px). `FormRenderer submitButtonContainerId` portals Submit into a footer band: `py-3 px-5 border-t bg-gray-25`, Cancel `outline small`. Components 1.0.3 `Drawer` now has a `footer` prop; prefer it over a band pinned inside the body. |
| Detail drawer | `Drawer position="right"`, `size` default `lg`. |
| Drawer widths | sm 320, md 480, lg 640, xl 800, full 100%. Below 640px, force `100vw` (see Part 4). |
| Motion | `--psp-dur-1: 90ms` (rows, carets), `-2: 140ms` (controls), `-3: 200ms` (panels). `--psp-ease-out: cubic-bezier(0,0,.2,1)`. All zeroed under `prefers-reduced-motion`. Popover entrance: 140ms, `translateY(-4px) scale(.98)` → none. |
| Fonts | Inter (opsz, 400-700) and JetBrains Mono (400-600) from Google Fonts, with `font-feature-settings: 'cv11','ss01','ss03'`. |

crud's own detail drawer defaults to `detailDrawerSize` `"md"`, not the `lg`
that its JSDoc states, and switches to `"full"` on mobile. A standalone `TableDrawer` defaults to `lg`
and **ignores `position`**.

---

## 4. Known CSS fixes when hosting crud

All of these are verified in the reference app CSS and still apply to 2.1.x.

| Fix | Why | Where |
|---|---|---|
| **PageTransition blank page.** `div[style*="width: 100%"][style*="height: 100%"] { opacity: 1 !important; transform: none !important; }` | crud wraps each route in a 400ms motion fade. A remount mid-animation leaves it stuck at opacity 0, so the page renders fully but invisibly. The selector matches crud's inline style, so re-check it when upgrading crud. |  |
| **react-select menu above popovers.** `.react-select__menu-portal { z-index: 10002 !important; }` | crud's table select portals its menu to `<body>` at z 9999. A filters popover at 10001 covers it, so options under the footer cannot be clicked. |  |
| **z-index ladder for popovers inside drawers** | Drawer and Dialog panels sit at z-50, and the components `Select` list at 9999. Put popovers at 10000 (backdrop) and 10001 (panel), and select menus at 10002. **z-index alone does not fix a modal Radix drawer:** content portalled to `<body>` outside it is `aria-hidden` and `pointer-events: none`. Mount it in the last `[role="dialog"]` instead (`popoverHost`). | `ui/types.ts:11-41` |
| **Drawers on phones.** `@media (max-width: 639px) { [role="dialog"].fixed.top-0.h-full { width: 100vw; max-width: 100vw; } }` | Drawer widths are fixed pixels with no responsive cap, so an `md` drawer hangs off a 393px screen. The `[data-zango-drawer]` attribute is now a stabler hook. |  |
| **Doubled selectors** (`.lg\:col-span-8.lg\:col-span-8`, `:root:root`) | appbuilder ships unlayered `grid-cols-*`/`col-span-*` and declares `--sidebar` on `:root`. Sheet order differs between dev and the zango build, so ties at (0,1,0) resolve differently on staging. Doubling to (0,2,0) wins in both. Every responsive variant paired with an unprefixed default must be listed, or it silently does nothing. | , `:652-692` |

---

## 5. What NOT to copy from the reference app

| Item | Why |
|---|---|
| Brand hexes or any `--color-*` values | They are tenant-specific. Your tenant theme serves the scale. |
| White page surface (`--psp-surface-page: var(--color-base-white)`) | An app-level choice that overrides the template's `#F8F9FB` ground. |
| System-font override (`--psp-font-sans`, the `*` rule) | Moves Apple's system font ahead of Inter for one app. Keep `--zango-font-family`. |
| Sidebar width tweaks (`--sidebar-width` 16rem → 244px, 17px nav icons) | Shell geometry for that app, not table styling. |
| `--zango-border-color-default: gray-100` | Turns a hover token into a hairline token and needs a fix-up (Part 1). |
| `.crud-filter-panel` accordion CSS and `useExpandAllFilters` | Replaced by `variant="fields"`. |
