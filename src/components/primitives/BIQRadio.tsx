import { forwardRef } from 'react';
import { Radio, type RadioProps, type RadioGroupProps } from '@mantine/core';

export type BIQRadioProps = RadioProps;
export type BIQRadioGroupProps = RadioGroupProps;

interface BIQRadioComponent extends ReturnType<typeof forwardRef<HTMLInputElement, BIQRadioProps>> {
  Group: typeof Radio.Group;
}

const BIQRadioBase = forwardRef<HTMLInputElement, BIQRadioProps>(function BIQRadio(
  { size = 'sm', ...rest },
  ref
) {
  return <Radio ref={ref} size={size} {...rest} />;
});

export const BIQRadio = BIQRadioBase as BIQRadioComponent;
BIQRadio.Group = Radio.Group;
