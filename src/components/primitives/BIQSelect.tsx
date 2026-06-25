import { forwardRef } from 'react';
import { NativeSelect, type NativeSelectProps } from '@mantine/core';

export type BIQSelectProps = NativeSelectProps;

/**
 * Select wrapper using Mantine NativeSelect (renders the browser's native
 * <select>). Plan §W2 calls for native (not Combobox) for speed: native
 * dropdowns are faster to open, paint, and accessibility comes for free.
 * Pass options via `data` exactly as you would with NativeSelect.
 */
export const BIQSelect = forwardRef<HTMLSelectElement, BIQSelectProps>(function BIQSelect(
  { size = 'sm', radius = 'sm', ...rest },
  ref
) {
  return <NativeSelect ref={ref} size={size} radius={radius} {...rest} />;
});
