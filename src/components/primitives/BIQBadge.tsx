import { forwardRef } from 'react';
import { Badge, type BadgeProps, type MantineColor } from '@mantine/core';

export type BIQStatus = 'Pending' | 'In Process' | 'Closed' | 'pending' | 'inProcess' | 'closed';

export const BIQ_STATUS_COLOR: Readonly<Record<BIQStatus, MantineColor>> = Object.freeze({
  Pending: 'yellow',
  'In Process': 'blue',
  Closed: 'gray',
  pending: 'yellow',
  inProcess: 'blue',
  closed: 'gray',
});

export interface BIQBadgeProps extends Omit<BadgeProps, 'color'> {
  color?: MantineColor;
  status?: BIQStatus;
}

export const BIQBadge = forwardRef<HTMLDivElement, BIQBadgeProps>(function BIQBadge(
  { status, color, variant = 'light', size = 'sm', children, ...rest },
  ref
) {
  if (import.meta.env.DEV && status !== undefined && color !== undefined) {
    console.warn(
      `[BIQBadge] both 'status' (${status}) and 'color' (${color}) provided; 'status' takes precedence.`
    );
  }
  const resolved = status !== undefined ? BIQ_STATUS_COLOR[status] : color;
  return (
    <Badge ref={ref} color={resolved} variant={variant} size={size} {...rest}>
      {children ?? status}
    </Badge>
  );
});
