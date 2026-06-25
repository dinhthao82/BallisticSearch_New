import { forwardRef } from 'react';
import { Button, type ButtonProps, createPolymorphicComponent } from '@mantine/core';

export type BIQButtonProps = ButtonProps & {
  type?: 'button' | 'submit' | 'reset';
  name?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const BIQButtonBase = forwardRef<HTMLButtonElement, BIQButtonProps>(function BIQButton(
  { size = 'sm', radius = 'sm', ...rest },
  ref
) {
  return <Button ref={ref} size={size} radius={radius} {...rest} />;
});

export const BIQButton = createPolymorphicComponent<'button', BIQButtonProps>(BIQButtonBase);
