import { useCallback, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipe(handlers: SwipeHandlers) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;

    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          handlers.onSwipeLeft?.();
        } else {
          handlers.onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          handlers.onSwipeUp?.();
        } else {
          handlers.onSwipeDown?.();
        }
      }
    }

    setTouchStart(null);
  }, [touchStart, handlers]);

  return {
    onTouchStart,
    onTouchEnd,
  };
}
