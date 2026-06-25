import { forwardRef } from 'react';
import { MultiSelect, type MultiSelectProps, type ComboboxItem } from '@mantine/core';

export interface BIQMultiselectProps extends Omit<MultiSelectProps, 'data'> {
  /**
   * Accepts the same shape Mantine's MultiSelect data prop accepts —
   * string[] or { value, label }[] (or grouped). Defaulted here as
   * required so callers don't trip on the optional-data prop's `data?:`
   * type and accidentally render an empty dropdown.
   */
  data: MultiSelectProps['data'];
}

/**
 * Multi-select wrapper. withinPortal default ON: BS-6159 filter chrome
 * uses .data-filter { overflow:hidden } which clips inline Mantine
 * combobox dropdowns. Portaling the overlay matches the legacy
 * jquery.multiselect workaround (body-level option div). Callers that
 * KNOW their container does not clip can pass
 * comboboxProps={{ withinPortal: false }} to override.
 */
export const BIQMultiselect = forwardRef<HTMLInputElement, BIQMultiselectProps>(
  function BIQMultiselect(
    { size = 'sm', radius = 'sm', searchable = true, comboboxProps, ...rest },
    ref
  ) {
    const merged = { withinPortal: true, ...comboboxProps };
    return (
      <MultiSelect
        ref={ref}
        size={size}
        radius={radius}
        searchable={searchable}
        comboboxProps={merged}
        {...rest}
      />
    );
  }
);

export type BIQMultiselectOption = ComboboxItem;
