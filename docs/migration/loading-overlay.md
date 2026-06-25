# EIQ_LoadingUI → BIQLoadingOverlay migration

**Source**: `BallisticSearch_2026_05_26/JScript/JSDefault/EIQ_LoadingUI.js`
**CSS source**: `BallisticSearch_2026_05_26/App_Themes/Theme1/CSSDefault/EIQ_LoadingUI.css`
**Markup source**: `BallisticSearch_2026_05_26/UserControl/EIQ_LoadingUI.ascx`
**Generated**: Step 37 (Wave A — W3)

## Legacy API surface

The legacy module exposes a global singleton `loadingUI` (jQuery + LNG i18n) plus a set of window-level wrappers. Every ASPX page already references one of these forms:

| Form                                                          | Args                     | Behavior                                                                                                            |
| ------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `loadingUI.Open(msg?)`                                        | msg: string \| undefined | Show overlay; if msg omitted/empty/null → fall back to `LNG.GetValue("annotation", "pleasewait", "Please Wait...")` |
| `loadingUI.Close()`                                           | –                        | Hide overlay; if `OnClose` callback is set, fire it once then null it                                               |
| `loadingUI.UpdateText(msg)`                                   | msg: string              | Replace overlay message while it is showing                                                                         |
| `loadingUI.OnClose`                                           | function \| null         | Optional one-shot callback fired immediately BEFORE `Close()` hides the overlay                                     |
| `ShowLoading(msg?)`                                           | alias                    | → `loadingUI.Open(msg)`                                                                                             |
| `HideLoading()`                                               | alias                    | → `loadingUI.Close()`                                                                                               |
| `UpdateLoadingText(msg)`                                      | alias                    | → `loadingUI.UpdateText(msg)`                                                                                       |
| `ShowProcessing` / `CloseProcessing` / `UpdateProcessingText` | aliases                  | identical to the three above                                                                                        |
| `ShowProcessingOverlay(cancelFn)`                             | cancelFn: function       | Assigns `loadingUI.OnClose = cancelFn` then calls `ShowLoading()`                                                   |
| `HideProcessingOverlay` / `CancelProcessing`                  | aliases                  | → `loadingUI.Close()`                                                                                               |

The cancel UX in the legacy module is implemented by **embedding an `<i class="fa fa-times loadingui-close" onclick="loadingUI.Close()">` icon directly inside the message HTML** via `$('#loading-msg').html(msg + iconHtml)`. Clicking it triggers `Close()`, which fires `OnClose` (i.e. the consumer's cancel handler) and then hides the overlay. There is no dedicated cancel button.

## Visual design (legacy CSS)

- Backdrop: `position:fixed; top:0; left:0; w/h:100%; bg:rgba(255,255,255,0.2); z-index:11111; cursor:wait`
- Centered modal card: `bg:rgba(255,255,255,0.9); border-radius:5px; max-width:480px; min-width:200px; box-shadow:0 2px 12px rgba(0,0,0,0.15); padding:15px`
- Message: `font-size:18px; max-width:320px`
- Close icon: Font Awesome `fa-times`, opacity 0.6 → 1 on hover

No spinner in the legacy markup; the cursor change (`cursor:wait`) and the static modal were the only visual indicators. We can match by adding a Mantine `Loader` (spinner) per the BS-6159 standardization.

## React port mapping

| Legacy concept                                      | React port                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Global singleton + jQuery DOM mutation              | Local component `<BIQLoadingOverlay>` placed in the JSX tree                                                           |
| `Open(msg)`                                         | Set `visible={true} message={msg}`                                                                                     |
| `Close()`                                           | Set `visible={false}` (parent owns the state)                                                                          |
| `UpdateText(msg)`                                   | Re-render with new `message` prop                                                                                      |
| `OnClose` callback + embedded close icon            | `onCancel?: () => void` prop; when set, render a Cancel button (Mantine `CloseButton` or Tabler `IconX`) that calls it |
| `LNG.GetValue("annotation", "pleasewait")` fallback | `useTranslation` + `t('common:state.loading')` fallback to `'Please wait…'`                                            |
| `z-index:11111`                                     | Mantine `LoadingOverlay` `zIndex` prop (default 200; bump to 1000 to clear toasts/modals)                              |

## Component contract (Step 38)

```tsx
interface BIQLoadingOverlayProps {
  visible: boolean;
  message?: string; // default: i18n('common:state.loading')
  onCancel?: () => void; // if set, renders a Cancel button next to the message
}
```

Acceptance:

- Renders nothing when `visible={false}` (no opacity-0 fade artifacts)
- Backdrop blocks pointer events while visible
- Spinner + message centered
- Cancel button only appears when `onCancel` is provided
- Clicking Cancel calls `onCancel()` exactly once per visible lifecycle
- ESC key triggers `onCancel()` if set (legacy did not support this, but it's expected for modal UX in 2026)

## Out of scope (Wave A)

- Imperative `messageBox.show(...)` style API (covered by W5 BIQMessageBox)
- Toast/non-blocking variant (covered by W5)
- Multi-stage progress (legacy didn't have it; not a port concern)
- Backwards-compat global aliases (legacy adapter layer can be added later if pages are ported wholesale)

## Existing POC `LoadingOverlay`

`src/components/feedback/LoadingOverlay.tsx` (POC Step 15) already wraps Mantine `LoadingOverlay` with a `visible/message` API. **BIQLoadingOverlay supersedes it** — same props plus `onCancel`. We will keep `LoadingOverlay` as a re-export of `BIQLoadingOverlay` for one cycle so the SearchAPL POC code keeps compiling; remove the alias in a later cleanup mission.
