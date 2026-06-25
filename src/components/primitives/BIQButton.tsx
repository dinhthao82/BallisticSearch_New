import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@mantine/core';

export type BIQButtonProps = ButtonProps & {
  type?: 'button' | 'submit' | 'reset';
  name?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const BIQButton = forwardRef<HTMLButtonElement, BIQButtonProps>(function BIQButton(
  { size = 'sm', radius = 'sm', ...rest },
  ref
) {
  return <Button ref={ref} size={size} radius={radius} {...rest} />;
});
