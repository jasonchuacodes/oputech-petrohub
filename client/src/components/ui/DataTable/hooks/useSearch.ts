import { useState } from 'react';

import type { DataTableSearchProps } from '../types';

export function useSearch(props?: DataTableSearchProps) {
  const [internalValue, setInternalValue] = useState(props?.defaultValue ?? '');

  // Support both controlled and uncontrolled modes
  const value = props?.value ?? internalValue;
  const setValue = props?.onValueChange ?? setInternalValue;

  return {
    enabled: props?.enabled ?? false,
    value,
    setValue,
    placeholder: props?.placeholder ?? 'Search',
  };
}
