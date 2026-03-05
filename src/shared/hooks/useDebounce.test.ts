// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('does not update the value before the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'hello' },
    });

    rerender({ value: 'world' });
    act(() => vi.advanceTimersByTime(499));

    expect(result.current).toBe('hello');
  });

  it('updates the value after the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'hello' },
    });

    rerender({ value: 'world' });
    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe('world');
  });

  it('resets the timer on rapid successive changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => vi.advanceTimersByTime(300));
    rerender({ value: 'c' });
    act(() => vi.advanceTimersByTime(300));

    // Only 300ms has passed since the last change — still debouncing
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('c');
  });
});
