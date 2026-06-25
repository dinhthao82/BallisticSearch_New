import { messageBox, type MessageVariant } from '@/components/modal';

/**
 * Thrown by GCTWindow.{open,openNew,openDashboard,OpenWindowSchedule,jWindow}
 * — the iframe-based popup methods that load whole legacy ASPX pages.
 * Those page targets must migrate before their entry point can lift; until
 * then, calling these helpers in a ported component is a programming error
 * the developer needs to see.
 */
export class LegacyAdapterError extends Error {
  constructor(method: string) {
    super(
      `GCTWindow.${method}() is an iframe popup loading a legacy ASPX page. ` +
        `Port the wrapped page first, then route to it directly instead of ` +
        `going through GCTWindow.`
    );
    this.name = 'LegacyAdapterError';
  }
}

interface LegacyOption {
  name?: string;
  value?: string;
  css?: string;
  fClick?: () => void;
  isClose?: boolean;
}

/**
 * Resolve an options[] array's final action — if any option has a custom
 * fClick callback, we have to ask the caller to migrate; this adapter only
 * supports the default OK-dismisses-the-box pattern. We fire fClick before
 * resolve so the legacy callback still runs.
 */
function runActionsThenClose(
  variant: MessageVariant,
  msg: string,
  options: LegacyOption[] | undefined,
  title?: string
): void {
  void messageBox[variant](msg, { title }).then(() => {
    if (!options || options.length === 0) return;
    // Match legacy single-action X-button behavior: if there's one option,
    // fire its fClick. With multiple, fire the LAST option's fClick (the
    // typical Cancel/Close button); matches MessageBox.js lines 187-191.
    const action = options.length === 1 ? options[0] : options[options.length - 1];
    if (action?.fClick) action.fClick();
  });
}

interface MessageBoxOpts {
  msg?: unknown;
  message?: unknown;
  title?: string;
  width?: number | string;
  height?: number | string;
  msgType?: '' | 'info' | 'success' | 'warning' | 'error';
  actions?: LegacyOption[];
  timeout?: number;
  onClose?: () => void;
}

function variantFromMsgType(msgType?: string): MessageVariant {
  switch (msgType) {
    case 'info':
      return 'info';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'alert';
  }
}

/**
 * Forwards every old GCTWindow.* method to the new messageBox surface.
 * Goal: ported pages that previously did
 *   GCTWindow.MessageBox({ msg: 'Hi', msgType: 'info' })
 * keep working with no other change beyond the import path.
 *
 * Methods that opened iframe popups throw LegacyAdapterError — those need
 * the wrapped page to migrate before they can lift.
 */
export const GCTWindow = {
  // ─── Message-box methods (these all map cleanly to messageBox.*) ────

  MessageBox(opts: MessageBoxOpts): void {
    const variant = variantFromMsgType(opts.msgType);
    void messageBox[variant](opts.msg ?? opts.message, {
      title: opts.title,
      timeout: opts.timeout,
      onClose: opts.onClose,
    }).then(() => {
      if (opts.actions && opts.actions.length > 0) {
        const action = opts.actions[opts.actions.length - 1];
        if (action?.fClick) action.fClick();
      }
    });
  },

  MessageBox_Language(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    option?: LegacyOption[],
    _subtitle?: string,
    _recognize?: unknown,
    msgType?: string
  ): void {
    runActionsThenClose(variantFromMsgType(msgType), String(mess ?? ''), option, title);
  },

  MessageBoxNoRecord(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    option?: LegacyOption[]
  ): void {
    runActionsThenClose('info', String(mess ?? ''), option, title);
  },

  MessageBox_Language_Special(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    option?: LegacyOption[]
  ): void {
    runActionsThenClose('alert', String(mess ?? ''), option, title);
  },

  MessageBox_NotMove(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    option?: LegacyOption[]
  ): void {
    runActionsThenClose('alert', String(mess ?? ''), option, title);
  },

  MessageBox_Language_Timeout_Main(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    option?: LegacyOption[]
  ): void {
    void messageBox
      .warn(String(mess ?? ''), {
        title,
        onClose: () => {
          // Match legacy redirect-on-close — relative ../login.aspx in the
          // legacy implementation. Future migration: route to the React
          // login page once it's wired.
          if (typeof window !== 'undefined') {
            window.location.href = '/login?logout=1';
          }
        },
      })
      .then(() => {
        if (option && option.length > 0) {
          const action = option[option.length - 1];
          if (action?.fClick) action.fClick();
        }
      });
  },

  MessageBox_Language_Timeout_Window(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    option?: LegacyOption[]
  ): void {
    void messageBox
      .warn(String(mess ?? ''), {
        title,
        onClose: () => {
          if (typeof window !== 'undefined') window.close();
        },
      })
      .then(() => {
        if (option && option.length > 0) {
          const action = option[option.length - 1];
          if (action?.fClick) action.fClick();
        }
      });
  },

  OpenConfirm(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    _option?: LegacyOption[]
  ): void {
    // Legacy OpenConfirm rendered Yes/No image buttons; modern code should
    // use confirm() from @/components/modal directly for a real boolean
    // promise. We fall back to messageBox.alert to keep call sites alive.
    void messageBox.alert(String(mess ?? ''), { title });
  },

  message(
    mess: unknown,
    title?: string,
    _width?: number,
    _height?: number,
    option?: LegacyOption[]
  ): void {
    runActionsThenClose('alert', String(mess ?? ''), option, title);
  },

  closeMessage(): void {
    // The new messageBox.* dialogs resolve when the user clicks OK or ESC;
    // there's no global imperative close because each call owns its own
    // host. If legacy code needs to force-close, it can remove all
    // [data-biq-msgbox-host] elements — but ported code should not do
    // that and instead let users dismiss naturally.
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-biq-msgbox-host]').forEach((el) => el.remove());
  },

  // ─── Iframe popup methods (deferred — throw clearly) ────────────────

  open(): never {
    throw new LegacyAdapterError('open');
  },
  openNew(): never {
    throw new LegacyAdapterError('openNew');
  },
  openDashboard(): never {
    throw new LegacyAdapterError('openDashboard');
  },
  OpenWindowSchedule(): never {
    throw new LegacyAdapterError('OpenWindowSchedule');
  },
  jWindow(): never {
    throw new LegacyAdapterError('jWindow');
  },
  jWindow_Wrap(): never {
    throw new LegacyAdapterError('jWindow_Wrap');
  },
  close(): never {
    throw new LegacyAdapterError('close');
  },
};
