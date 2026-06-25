# jquery.multiselect → BIQMultiselect migration

**Source**: `BallisticSearch_2026_05_26/JScript/jquery.multiselect.js` (~997 lines, v2.3.0 by P. Springstubbe)
**CSS source**: `BallisticSearch_2026_05_26/App_Themes/Theme1/jquery.multiselect.css`
**Generated**: Step 50 (Wave A — W7)

## Legacy plugin scope

A jQuery plugin that decorates a native `<select multiple>` with a clickable button + dropdown panel of checkboxes. Triggered as:

```js
$('select[multiple]').multiselect({ texts: { placeholder: 'Select states' } });
$('select[multiple]').multiselect('reload');
$('select[multiple]').multiselect('loadOptions', [{ name, value, checked, attributes }, ...]);
```

## Feature inventory

Distilled from the `defaults` block (lines ~36-75) and the runtime handlers:

| Feature                                                             | Default          | Notes                                                                      |
| ------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------- |
| `columns`                                                           | 1                | Multi-column grid for long option lists                                    |
| `search`                                                            | false            | Inline search box above the option list                                    |
| `searchOptions.showOptGroups`                                       | false            | Keep optgroup labels visible during search                                 |
| `searchOnlyNoneSelected`                                            | false            | Hide checked items from the search filter                                  |
| `texts.{placeholder,search,selectedOptions,selectAll,noneSelected}` | i18n hooks       |
| `selectAll`                                                         | false            | Renders a "Select all" toggle at the top                                   |
| `selectGroup`                                                       | true             | Clicking an optgroup label toggles all of its children                     |
| `minHeight` / `maxHeight`                                           | 200 / null       | Option overlay vertical bounds                                             |
| `showCheckbox`                                                      | true             | Toggle the checkbox indicator                                              |
| `singleSelect`                                                      | false            | Degrades to a single-select picker                                         |
| `optionAttributes`                                                  | []               | Copy named `<option>` attrs onto the rendered checkbox                     |
| `onLoad / onOptionClick / onControlClose`                           | callbacks        | Lifecycle hooks                                                            |
| `widthCombo` / `minWidth` / `maxWidth`                              | 190 / 400 / null | Width control                                                              |
| `minSelect / maxSelect`                                             | false            | Selection-count bounds                                                     |
| `divName`                                                           | ''               | DOM `name` on the popup `<div>` (used by other code to position it)        |
| `position`                                                          | 'UP'             | Overlay opens upward by default (legacy filter chrome lives at the bottom) |
| `useBootstrap`                                                      | false            | Toggle Bootstrap CSS classes on the wrapper                                |

The plugin also exposes imperative actions: `'reload'`, `'loadOptions'`, `'addOptions'`, `'getSelected'`, `'getCheckedItems'`, `'select'`, `'deselect'`, `'destroy'`.

## Call sites in legacy

Rough grep across the legacy project shows ~30 call sites — most pass a `placeholder` text and rely on the `UP`-positioned dropdown over a fixed bottom filter row. A few pages enable `search`, `selectAll`, and `columns: 2` for long agency lists.

## Known integration footgun (carried over to BIQ)

POC's CLAUDE.md noted: the Mantine MultiSelect dropdown gets visually clipped when the trigger is rendered inside `.data-filter { overflow: hidden }`. The legacy plugin worked around this by positioning the option overlay as a body-level `<div>`. **BIQMultiselect must explicitly opt into Mantine's `withinPortal` (or set `comboboxProps={{ withinPortal: true }}`) so the dropdown escapes the filter container's overflow clip.**

## Port mapping

| Legacy concept                        | BIQMultiselect approach                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `texts.placeholder`                   | `placeholder` prop on Mantine MultiSelect                                                                               |
| `texts.search`                        | `searchable` + `nothingFoundMessage`                                                                                    |
| `selectAll`                           | Custom `selectAllLabel` prop + manual toggle action                                                                     |
| `search`                              | `searchable`                                                                                                            |
| `singleSelect`                        | Caller uses `<BIQSelect>` instead — separate primitive                                                                  |
| `columns`                             | Out of scope (Mantine MultiSelect lays out vertically; multi-column dropdowns are an exotic UX we won't carry over)     |
| `position: 'UP'`                      | Mantine handles this automatically via flip placement; explicit `position="top"` on the combobox isn't generally needed |
| `onOptionClick` / `onControlClose`    | Map to `onChange` + `onDropdownClose`                                                                                   |
| `withinPortal` clip-fix               | Default ON in BIQMultiselect                                                                                            |
| `loadOptions([...])`                  | Caller updates `data` prop (declarative)                                                                                |
| `getSelected` / `select` / `deselect` | Caller owns selection state (controlled component)                                                                      |

## Component contract (Step 51)

```ts
interface BIQMultiselectProps extends Omit<MultiSelectProps, 'data' | 'value' | 'onChange'> {
  data: { value: string; label: string }[] | string[];
  value: string[];
  onChange: (next: string[]) => void;
  /** Default ON — required for filter chrome with overflow:hidden. */
  withinPortal?: boolean;
  /** When true, renders a Select-all/Clear-all row above the option list. */
  selectAllLabel?: string;
  /** Empty-state message inside the dropdown. */
  nothingFoundMessage?: string;
}
```

## Out of scope (Wave A)

- `columns > 1` multi-column dropdown — exotic, no real BIQ use case
- `optionAttributes` carry-over — Mantine's options API is `{ value, label }`; custom attributes belong in the option's `disabled`/`group` Mantine fields or in caller-owned state
- Bootstrap CSS toggle — Mantine theme replaces it wholesale
- `useBootstrap` / `widthCombo` raw-pixel sizing — Mantine sizing tokens cover the same ground via the `size` prop
- Imperative reload — declarative `data` prop subsumes it
