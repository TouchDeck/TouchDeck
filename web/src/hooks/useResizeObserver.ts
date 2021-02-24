import { RefObject, useEffect } from 'react';

export function useResizeObserver(
  ref: RefObject<HTMLElement>,
  callback: (rect: DOMRectReadOnly) => void
): void {
  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver((entries) =>
        callback(entries[0].contentRect)
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref, callback]);
}
