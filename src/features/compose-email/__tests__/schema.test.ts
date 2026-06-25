import { describe, it, expect } from 'vitest';
import { composeEmailSchema, defaultComposeEmailValues } from '../schema';

describe('composeEmailSchema', () => {
  it('valid single recipient', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'alice@example.com',
      subject: 'Hi',
      body: 'Hello there',
    });
    expect(result.success).toBe(true);
  });

  it('valid multiple recipients (comma)', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'alice@example.com, bob@example.com',
      subject: 'Hi',
      body: 'Hello',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty to', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      subject: 'Hi',
      body: 'Hello',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email in to', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'not-an-email',
      subject: 'Hi',
      body: 'Hello',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mixed valid/invalid in to', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'alice@example.com, broken',
      subject: 'Hi',
      body: 'Hello',
    });
    expect(result.success).toBe(false);
  });

  it('allows empty cc', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'alice@example.com',
      subject: 'Hi',
      body: 'Hello',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid cc', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'alice@example.com',
      cc: 'broken',
      subject: 'Hi',
      body: 'Hello',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty subject', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'alice@example.com',
      subject: '',
      body: 'Hello',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty body', () => {
    const result = composeEmailSchema.safeParse({
      ...defaultComposeEmailValues,
      to: 'alice@example.com',
      subject: 'Hi',
      body: '',
    });
    expect(result.success).toBe(false);
  });
});
