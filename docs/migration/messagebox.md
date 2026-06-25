# MessageBox / GCTWindow → BIQMessageBox migration

**Source**: `BallisticSearch_2026_05_26/JScript/MessageBox.js` (~675 lines)
**Generated**: Step 43 (Wave A — W5)

## Legacy file scope

`MessageBox.js` is the Phase-5 (2026-03) consolidation of two earlier files (`GtcWindow.js`, `GtcWindow_new.js`) into one. It carries:

1. **CreateMessageBox** — primary jQuery-free message-dialog primitive (lines 60-205)
2. **CloseMessageBox** — close current dialog with onClose callback support (lines 211-240)
3. **Convenience helpers** — MessageInfo / MessageSuccess / MessageWarning / MessageError / MessageHtml (lines 256-278)
4. **Legacy popup window** — `_openPopupWindow` / `_closePopupWindow` for iframe-based modals (lines 290-373)
5. **GCTWindow compat layer** — 16 method aliases mapping every old API to CreateMessageBox / `_openPopupWindow` (lines 442-624)
6. **Unrelated stragglers** — `getPageSize()`, `Defines_AK_AR` data array (kept in file historically)

## Variant taxonomy

| Variant   | Icon                    | Color            | Default title             | Plan §44 mapping     |
| --------- | ----------------------- | ---------------- | ------------------------- | -------------------- |
| `info`    | fa-info-circle          | `#17a2b8` cyan   | "Information"             | `messageBox.info`    |
| `success` | fa-check-circle         | `#28a745` green  | "Success"                 | (bonus; not in plan) |
| `warning` | fa-exclamation-triangle | `#ffc107` yellow | "Warning"                 | `messageBox.warn`    |
| `error`   | fa-times-circle         | `#dc3545` red    | "Error"                   | `messageBox.error`   |
| (no type) | —                       | (default)        | "Ballistics IQ - WARNING" | `messageBox.alert`   |

Plan §W5 calls for **alert / info / warn / error**. Legacy has those plus success — we'll port all 5 (success is a tiny extra and useful for save-confirmations).

## Behavioral details worth keeping

- **Non-string coercion** (`_msgToString`, lines 34-57). The legacy module accepts Error/XHR/response objects and walks a list of known keys (`msg`, `message`, `Message`, `error`, `Error`, `errorMessage`, `statusText`, `responseText`, `text`, `Text`, `description`) before falling back to JSON.stringify. Drop in TS: callers should pass `string`; we accept `string | Error | unknown` and apply the same coercion for parity with bad callers in ported code.
- **ESC closes** (line 174 — `keyCode === 27`).
- **Enter is preventDefault** (line 175 — prevents accidental form submits while modal is open).
- **Auto-close timeout** (lines 73, 199-203): if `opts.timeout > 0`, the box self-closes. Useful for transient success messages.
- **onClose callback** stored on the DOM element (line 130), fired on Close (line 220-222).
- **Single-modal at a time**: `CloseMessageBox` removes ALL `.eiq-msg-box` elements (line 232) — there is no stack semantics. We'll match this for parity.
- **Custom `actions` array**: `[{ name, css, fClick, isClose }]` builds the footer buttons; if absent, a single default "Close" button is rendered.

## React port API

Two surfaces:

```ts
// Imperative — drop-in for window.alert + the legacy MessageInfo/etc.
messageBox.alert(message, options?)   : Promise<void>
messageBox.info(message, options?)    : Promise<void>
messageBox.success(message, options?) : Promise<void>   // bonus
messageBox.warn(message, options?)    : Promise<void>
messageBox.error(message, options?)   : Promise<void>

// Toast — non-blocking, auto-dismiss (sonner backend)
messageBox.toast.info(message)
messageBox.toast.success(message)
messageBox.toast.warn(message)
messageBox.toast.error(message)
```

`options`:

```ts
interface BIQMessageBoxOptions {
  title?: string;
  timeout?: number; // auto-close ms; 0/undefined = manual close
  onClose?: () => void;
}
```

Built on **BIQModal** for the imperative path (reuse focus trap, ESC, returnFocus), and **sonner** for the toast path (separate dependency).

## Step 45 legacy adapter

`src/legacy-adapter/GCTWindow.ts` exposes a global-shaped object that delegates every old GCTWindow.\* method to BIQMessageBox. Goal: a ported page that previously did

```js
GCTWindow.MessageBox({ msg: 'Hello', msgType: 'info', title: 'Hi' });
```

can `import { GCTWindow } from '@/legacy-adapter/GCTWindow'` and the call site needs zero other changes. We support the 80% of methods that map cleanly to BIQMessageBox; the iframe popup methods (`open`, `openNew`, `openDashboard`, `OpenWindowSchedule`, `jWindow`) throw a `LegacyAdapterError` with a TODO message — iframe popups belong to a later migration step (probably tied to the route the iframe was loading).

## Out of scope (Wave A)

- iframe popup methods — those open whole legacy ASPX pages; out of scope until the wrapped page is ported
- Drag-to-move modal (`MessageBox_NotMove` legacy distinguished — modern modal is never draggable)
- Custom-width hint via `width:'480px'` — Mantine Modal `size` covers `xs|sm|md|lg|xl` plus arbitrary px
- The `Defines_AK_AR` data array — unrelated to messaging; lives in this file by historical accident and should move to a domain module when its callers migrate
