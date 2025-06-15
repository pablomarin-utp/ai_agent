import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface RateLimitState {
  isBlocked: boolean;
  remainingTime: number;
}

export const useRateLimitHandling = () => {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isBlocked: false,
    remainingTime: 0,
  });

  const handleRateLimit = useCallback((retryAfterSeconds: number) => {
    setRateLimitState({
      isBlocked: true,
      remainingTime: retryAfterSeconds,
    });

    toast.error(`Rate limit exceeded. Please wait ${retryAfterSeconds} seconds.`);

    // Countdown timer
    const interval = setInterval(() => {
      setRateLimitState((prev) => {
        const newTime = prev.remainingTime - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          return { isBlocked: false, remainingTime: 0 };
        }
        return { ...prev, remainingTime: newTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearRateLimit = useCallback(() => {
    setRateLimitState({ isBlocked: false, remainingTime: 0 });
  }, []);

  return {
    rateLimitState,
    handleRateLimit,
    clearRateLimit,
  };
};