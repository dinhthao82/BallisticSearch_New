import type { ReactNode } from 'react';
import { Modal, type ModalProps, Stack, Group, Divider } from '@mantine/core';

export interface BIQModalProps extends Omit<ModalProps, 'children'> {
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * Click-outside-to-close is disabled by default — modal content is usually
 * a form or destructive action confirmation; an accidental backdrop click
 * should not destroy state. Callers that want backdrop-dismiss UX must opt
 * in explicitly via `closeOnClickOutside`.
 */
export function BIQModal({
  closeOnClickOutside = false,
  closeOnEscape = true,
  trapFocus = true,
  returnFocus = true,
  centered = true,
  children,
  footer,
  ...rest
}: BIQModalProps) {
  return (
    <Modal
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      trapFocus={trapFocus}
      returnFocus={returnFocus}
      centered={centered}
      {...rest}
    >
      <Stack gap="md">
        <div data-testid="biq-modal-body">{children}</div>
        {footer && (
          <>
            <Divider />
            <Group justify="flex-end" gap="sm" data-testid="biq-modal-footer">
              {footer}
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
