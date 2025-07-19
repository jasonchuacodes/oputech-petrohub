import { Stack } from '@mui/material';
import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material';

import { Button } from '../Button';

type StepNavigationProps = {
  onNext: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  hidePrevious?: boolean;
  disabled?: boolean
  loading?: boolean
};

export const StepNavigation = ({
  onNext,
  onPrevious,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  hidePrevious = false,
  disabled,
  loading
}: StepNavigationProps) => {
  return (
    <Stack direction="row" justifyContent="space-between" mt={5}>
      {!hidePrevious ? (
        <Button
          onClick={onPrevious}
          variant="outlined"
          size="small"
          startIcon={<ArrowBackOutlined fontSize="inherit" />}
        >
          {previousLabel}
        </Button>
      ) : (
        <div />
      )}

      <Button
        disabled={disabled}
        loading={loading}
        onClick={onNext}
        variant="contained"
        size="small"
        endIcon={<ArrowForwardOutlined fontSize="inherit" />}
      >
        {nextLabel}
      </Button>
    </Stack>
  );
};
