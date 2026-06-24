import type { ReactNode } from 'react';
import classes from './DataResult.module.css';

/**
 * Main content area (right of DataFilter). Mirrors legacy `.data-result`:
 *   flex: 1
 *   min-width: 0 (prevents flex overflow)
 *   display: flex column
 */
export function DataResult({ children }: { children: ReactNode }) {
  return (
    <section className={classes.dataResult} data-testid="data-result">
      {children}
    </section>
  );
}
