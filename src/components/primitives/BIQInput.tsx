import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from '@mantine/core';

export type BIQInputProps = TextInputProps;

export const BIQInput = forwardRef<HTMLInputElement, BIQInputProps>(function BIQInput(
  { size = 'sm', radius = 'sm', ...rest },
  ref
) {
  return <TextInput ref={ref} size={size} radius={radius} {...rest} />;
});
