import type { ReactNode } from 'react';
import classes from './BoxFilter.module.css';

interface BoxFilterProps {
  title?: string;
  children: ReactNode;
  /** Pass-through max width override. */
  maxWidth?: string;
}

/**
 * Card-style filter container with optional title bar.
 * Mirrors legacy `.box-filter` + `.box-filter-title` (BS-6159):
 *   padding: 1rem
 *   white background, rounded, soft shadow
 *   title: flex justify-between, bottom border separator
 */
export function BoxFilter({ title, children, maxWidth }: BoxFilterProps) {
  return (
    <div
      className={classes.boxFilter}
      style={maxWidth ? { maxWidth } : undefined}
      data-testid="box-filter"
    >
      {title && (
        <div className={classes.boxFilterTitle}>
          <h3>{title}</h3>
        </div>
      )}
      <div className={classes.boxFilterContent}>{children}</div>
    </div>
  );
}
