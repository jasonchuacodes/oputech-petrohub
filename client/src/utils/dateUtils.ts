import type { Dayjs } from "dayjs";

export const formatRange = (start: Dayjs | null, end: Dayjs | null) =>
  `${start ? start.format('MM/DD/YY') : 'MM/DD/YY'} - ${
    end ? end.format('MM/DD/YY') : 'MM/DD/YY'
  }`;
  