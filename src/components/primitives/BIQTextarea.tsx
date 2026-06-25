import { forwardRef } from 'react';
import { Textarea, type TextareaProps } from '@mantine/core';

export type BIQTextareaProps = TextareaProps;

/**
 * Multi-row text input wrapping Mantine Textarea.
 * Defaults match BS-6159 multi-line filter inputs (2 rows visible, grows to 5).
 */
export const BIQTextarea = forwardRef<HTMLTextAreaElement, BIQTextareaProps>(function BIQTextarea(
  { size = 'sm', radius = 'sm', autosize = true, minRows = 2, maxRows = 5, ...rest },
  ref
) {
  return (
    <Textarea
      ref={ref}
      size={size}
      radius={radius}
      autosize={autosize}
      minRows={minRows}
      maxRows={maxRows}
      {...rest}
    />
  );
});
