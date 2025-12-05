import { useInactivityContext } from '~/context/inactivity';

import { InactivityWarning } from './index';

export const InactivityWarningContainer = () => {
  const { isWarningShown, remainingSeconds, resetTimer } = useInactivityContext();

  return (
    <InactivityWarning
      open={isWarningShown}
      remainingSeconds={remainingSeconds}
      onStayLoggedIn={resetTimer}
    />
  );
};
