import { useCallback, useEffect, useRef, useState } from 'react';

const INACTIVITY_TIMEOUT = 0.1 * 60 * 1000;
const WARNING_DURATION = 15 * 1000;
const THROTTLE_DELAY = 1000;
const STORAGE_KEY = 'inactivity_last_activity';
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart'];

type UseInactivityTimerOptions = {
  enabled: boolean;
  onTimeout: () => void;
};

type UseInactivityTimerReturn = {
  isWarningShown: boolean;
  remainingSeconds: number;
  resetTimer: () => void;
};

export const useInactivityTimer = ({
  enabled,
  onTimeout,
}: UseInactivityTimerOptions): UseInactivityTimerReturn => {
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(WARNING_DURATION / 1000);
  const lastActivityTimeRef = useRef(Date.now());
  const lastCallRef = useRef(0);
  const hasLoggedOutRef = useRef(false);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastActivityTimeRef.current = now;
    
    setIsWarningShown(false);
    setRemainingSeconds(WARNING_DURATION / 1000);

    hasLoggedOutRef.current = false;
    localStorage.setItem(STORAGE_KEY, String(now));
  }, []);

  const handleActivity = useCallback(() => {
    const now = Date.now();

    if (now - lastCallRef.current >= THROTTLE_DELAY) {
      lastCallRef.current = now;
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const timestamp = parseInt(e.newValue, 10);
        if (!isNaN(timestamp)) {
          lastActivityTimeRef.current = timestamp;
          setIsWarningShown(false);
          setRemainingSeconds(WARNING_DURATION / 1000);
          hasLoggedOutRef.current = false;
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, handleActivity]);

  useEffect(() => {
    if (!enabled) {
      setIsWarningShown(false);
      setRemainingSeconds(WARNING_DURATION / 1000);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - lastActivityTimeRef.current;

      if (elapsedTime >= INACTIVITY_TIMEOUT + WARNING_DURATION) {
        if (!hasLoggedOutRef.current) {
          hasLoggedOutRef.current = true;

          setIsWarningShown(false);
          onTimeout();
        }
      } else if (elapsedTime >= INACTIVITY_TIMEOUT) {
        const timeInWarningPeriod = elapsedTime - INACTIVITY_TIMEOUT;
        const remaining = Math.ceil((WARNING_DURATION - timeInWarningPeriod) / 1000);

        setIsWarningShown(true);
        setRemainingSeconds(Math.max(0, remaining));
      } else {
        setIsWarningShown(false);
        setRemainingSeconds(WARNING_DURATION / 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, onTimeout]);

  useEffect(() => {
    if (enabled) {
      resetTimer();
    }
  }, [enabled, resetTimer]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE_KEY);
    };
  }, []);

  return {
    isWarningShown,
    remainingSeconds,
    resetTimer,
  };
};
