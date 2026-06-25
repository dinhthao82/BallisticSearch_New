import { forwardRef } from 'react';
import { Checkbox, type CheckboxProps, type CheckboxGroupProps } from '@mantine/core';

export type BIQCheckboxProps = CheckboxProps;
export type BIQCheckboxGroupProps = CheckboxGroupProps;

const BIQCheckboxBase = forwardRef<HTMLInputElement, BIQCheckboxProps>(function BIQCheckbox(
  { size = 'sm', ...rest },
  ref
) {
  return <Checkbox ref={ref} size={size} {...rest} />;
});

export const BIQCheckbox = Object.assign(BIQCheckboxBase, {
  Group: Checkbox.Group,
  Indicator: Checkbox.Indicator,
  Card: Checkbox.Card,
});
