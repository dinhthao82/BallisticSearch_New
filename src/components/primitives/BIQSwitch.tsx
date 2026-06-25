import { forwardRef } from 'react';
import { Switch, type SwitchProps } from '@mantine/core';

export type BIQSwitchProps = SwitchProps;

export const BIQSwitch = forwardRef<HTMLInputElement, BIQSwitchProps>(function BIQSwitch(
  { size = 'sm', ...rest },
  ref
) {
  return <Switch ref={ref} size={size} {...rest} />;
});
