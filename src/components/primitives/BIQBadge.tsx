import { forwardRef } from 'react';
import { Badge, type BadgeProps } from '@mantine/core';

/**
 * APL/legacy report-status color map.
 * Extracted from SearchAPLResults.tsx (POC Step 18 / Step 21 visual parity).
 * Keys cover both display strings ('Pending', 'In Process', 'Closed') and
 * lowercase ids ('pending', 'inProcess', 'closed') so callers can pass
 * either form without normalizing first.
 */
export const BIQ_STATUS_COLOR: Readonly<Record<string, string>> = Object.freeze({
  Pending: 'yellow',
  'In Process': 'blue',
  Closed: 'gray',
  pending: 'yellow',
  inProcess: 'blue',
  closed: 'gray',
});

export interface BIQBadgeProps extends Omit<BadgeProps, 'color'> {
  /**
   * Either a status string from BIQ_STATUS_COLOR, or any Mantine color name.
   * Unknown values fall through to Mantine's default theming.
   */
  color?: string;
  status?: keyof typeof BIQ_STATUS_COLOR;
}

export const BIQBadge = forwardRef<HTMLDivElement, BIQBadgeProps>(function BIQBadge(
  { status, color, variant = 'light', size = 'sm', children, ...rest },
  ref
) {
  const resolved = status ? BIQ_STATUS_COLOR[status] : color;
  return (
    <Badge ref={ref} color={resolved} variant={variant} size={size} {...rest}>
      {children ?? status}
    </Badge>
  );
});
