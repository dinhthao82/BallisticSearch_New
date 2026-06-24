import { useState, type ReactNode } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import classes from './DataFilter.module.css';

interface DataFilterProps {
  children: ReactNode;
  /** Initially collapsed state. Default false. */
  defaultCollapsed?: boolean;
  /** External label for the toggle button (a11y). */
  toggleLabel?: string;
}

/**
 * Collapsible sidebar (left). Mirrors legacy `.data-filter` (BS-6159):
 *   width: 20%
 *   min-width: 18rem
 *   transition on collapse
 * Toggle button persists at the top-right.
 */
export function DataFilter({
  children,
  defaultCollapsed = false,
  toggleLabel = 'Toggle filter sidebar',
}: DataFilterProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <aside
      className={clsx(classes.dataFilter, collapsed && classes.collapsed)}
      data-testid="data-filter"
      data-collapsed={collapsed}
    >
      <div className={classes.toggleRow}>
        <Tooltip label={toggleLabel}>
          <ActionIcon
            variant="subtle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={toggleLabel}
            aria-expanded={!collapsed}
          >
            {collapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
          </ActionIcon>
        </Tooltip>
      </div>
      <div className={classes.content}>{children}</div>
    </aside>
  );
}
