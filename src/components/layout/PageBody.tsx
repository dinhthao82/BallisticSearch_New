import type { ReactNode } from 'react';
import classes from './PageBody.module.css';

/**
 * Root flex container for filter-result pages.
 * Mirrors legacy `.page-body` (BS-6159):
 *   display: flex
 *   padding: 0.5rem 1rem
 *   column-gap: 1rem
 * Children: a <DataFilter> sidebar + a <DataResult> main area.
 */
export function PageBody({ children }: { children: ReactNode }) {
  return <div className={classes.pageBody}>{children}</div>;
}
