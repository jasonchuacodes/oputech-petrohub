import { useState } from 'react';

import type { DateRange } from '../../DateRangePicker';
import type { DataTableDateRangeProps } from '../types';

export function useDateRange(props?: DataTableDateRangeProps) {
  const [internalStartValue, setInternalStartValue] = useState(props?.defaultStartValue ?? null);
  const [internalEndValue, setInternalEndValue] = useState(props?.defaultEndValue ?? null);

  // Support both controlled and uncontrolled modes
  const startValue = props?.startValue ?? internalStartValue;
  const endValue = props?.endValue ?? internalEndValue;

  const setRangeValue = props?.onRangeChange ?? ((range: DateRange) => {
    setInternalStartValue(range.start ?? null);
    setInternalEndValue(range.end ?? null);
  });

  return {
    enabled: props?.enabled ?? false,
    startValue,
    endValue,
    setRangeValue,
    label: props?.label ?? 'Select Date Range',
  };
}
