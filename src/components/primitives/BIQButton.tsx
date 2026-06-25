import { forwardRef, type MouseEvent } from 'react';
import { Button, type ButtonProps } from '@mantine/core';

export interface BIQButtonProps extends ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  name?: string;
  value?: string;
}

export const BIQButton = forwardRef<HTMLButtonElement, BIQButtonProps>(function BIQButton(
  { size = 'sm', radius = 'sm', ...rest },
  ref
) {
  return <Button ref={ref} size={size} radius={radius} {...rest} />;
});
