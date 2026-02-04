import { AnalyticsCard } from '../AnalyticsCard';
import { formatNumber } from '~/utils/number';
import theme from '~/theme';

interface TotalDisposalsProps {
  title: string;
  value: number;
  changePercentage: number;
  isLoading: boolean;
}

export const TotalDisposals = ({
  title,
  value,
  changePercentage,
  isLoading
}: TotalDisposalsProps) => {
  return (
    <AnalyticsCard
      title={title}
      value={value}
      changePercentage={changePercentage}
      datapoints={[]}
      valueFormatter={(value) => `${formatNumber(value, 3)} L`}
      color={theme.palette.warning.main}
      graph={false}
      loading={isLoading}
    />
  );
};
