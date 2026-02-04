import { Box, Stack, Typography } from '@mui/material';
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';

import { Show } from '~/components/ui';
import type { AnalyticsDataPoint } from '~/services/analytics/analytics.types';
import theme from '~/theme';

import { LoadingSkeleton } from './LoadingSkeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

type AnalyticsCardProps = {
  title: string;
  value: number;
  changePercentage: number;
  datapoints: AnalyticsDataPoint[];
  valueFormatter?: (value: number) => string;
  color?: string;
  graph?: boolean;
  loading?: boolean;
};

export const AnalyticsCard = ({
  title,
  value,
  changePercentage,
  datapoints,
  valueFormatter = (val) => val.toLocaleString(),
  color = theme.palette.primary.main,
  graph = true,
  loading = false,
}: AnalyticsCardProps) => {
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          callback: function (value, index, ticks) {
            if (index === 0 || index === ticks.length - 1) {
              return this.getLabelForValue(value as number);
            }
            return '';
          },
        },
      },
      y: {
        min: 0,
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 3,
          callback: function (value) {
            const numValue = Number(value);
            if (numValue >= 1000) {
              return `${(numValue / 1000).toFixed(0)}K`;
            }
            return numValue.toString();
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.2,
        borderWidth: 2,
      },
    },
  };

  const datapointsConfig = {
    labels: datapoints.map((dp) => format(new Date(dp.timestamp), 'MMM d')),
    datasets: [
      {
        data: datapoints.map((dp) => dp.value),
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };

  const isPositiveChange = changePercentage >= 0;
  const changeIcon = isPositiveChange ? '↑' : '↓';
  const changeColor = isPositiveChange ? 'success.main' : 'error.main';

  if (loading) {
    return <LoadingSkeleton graph={graph} />;
  }

  return (
    <Stack
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="h4" color="text.primary" fontWeight={600}>
          {valueFormatter(value)}
        </Typography>
      </Stack>

      <Show when={graph}>
        <Box
          sx={{
            height: 160,
            width: '100%',
          }}
        >
          <Line options={chartOptions} data={datapointsConfig} />
        </Box>
      </Show>

      <Typography variant="body2" color="text.secondary">
        <Box component="span" sx={{ color: changeColor, mr: 0.5 }}>
          {changeIcon} {Math.abs(changePercentage).toFixed(2)}%
        </Box>
        vs previous period
      </Typography>
    </Stack>
  );
};
