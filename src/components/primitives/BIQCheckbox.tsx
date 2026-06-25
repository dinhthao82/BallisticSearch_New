import { forwardRef } from 'react';
import { Checkbox, type CheckboxProps, type CheckboxGroupProps } from '@mantine/core';

export type BIQCheckboxProps = CheckboxProps;
export type BIQCheckboxGroupProps = CheckboxGroupProps;

interface BIQCheckboxComponent extends ReturnType<
  typeof forwardRef<HTMLInputElement, BIQCheckboxProps>
> {
  Group: typeof Checkbox.Group;
}

const BIQCheckboxBase = forwardRef<HTMLInputElement, BIQCheckboxProps>(function BIQCheckbox(
  { size = 'sm', ...rest },
  ref
) {
  return <Checkbox ref={ref} size={size} {...rest} />;
});

export const BIQCheckbox = BIQCheckboxBase as BIQCheckboxComponent;
BIQCheckbox.Group = Checkbox.Group;
