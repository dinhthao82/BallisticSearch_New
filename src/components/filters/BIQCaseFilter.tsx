import { BIQTextarea } from '@/components/primitives';

export interface BIQCaseFilterProps {
  value?: string;
  onChange?: (raw: string) => void;
  label?: string;
  placeholder?: string;
}

/**
 * Splits the raw textarea on whitespace OR commas, drops empty tokens,
 * and validates each — only alphanumeric + dash allowed (matches the
 * legacy case-number format used by ~15 BS-6159 search pages).
 */
const VALID_CASE_RE = /^[A-Za-z0-9-]+$/;

export function parseCaseNumbers(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function invalidCaseNumbers(raw: string): string[] {
  return parseCaseNumbers(raw).filter((t) => !VALID_CASE_RE.test(t));
}

export function isValidCaseInput(raw: string): boolean {
  return invalidCaseNumbers(raw).length === 0;
}

export function BIQCaseFilter({
  value = '',
  onChange,
  label = 'Case / Incident #',
  placeholder = 'One per line or comma-separated',
}: BIQCaseFilterProps) {
  const bad = invalidCaseNumbers(value);
  const error =
    bad.length > 0
      ? `Invalid (alphanumeric and dashes only): ${bad.slice(0, 3).join(', ')}${
          bad.length > 3 ? ` (+${bad.length - 3} more)` : ''
        }`
      : undefined;

  return (
    <BIQTextarea
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.currentTarget.value)}
      error={error}
      data-testid="biq-case-filter"
    />
  );
}
