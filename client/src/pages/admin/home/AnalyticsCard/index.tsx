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

import type { AnalyticsDataPoint } from '~/services/analytics/analytics.types';
import theme from '~/theme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

type AnalyticsCardProps = {
  title: string;
  value: number;
  changePercentage: number;
  chartData: AnalyticsDataPoint[];
  valueFormatter?: (value: number) => string;
};

export const AnalyticsCard = ({
  title,
  value,
  changePercentage,
  chartData,
  valueFormatter = (val) => val.toLocaleString(),
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
          maxTicksLimit: 10,
        },
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderWidth: 2,
      },
    },
  };

  const chartDataConfig = {
    labels: chartData.map((dp) => format(new Date(dp.timestamp), 'MMM dd')),
    datasets: [
      {
        data: chartData.map((dp) => dp.value),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
      },
    ],
  };

  const isPositiveChange = changePercentage >= 0;
  const changeIcon = isPositiveChange ? '↑' : '↓';
  const changeColor = isPositiveChange ? 'success.main' : 'error.main';

  return (
    <Stack
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="body1" color="text.primary">
          {title}
        </Typography>
        <Typography variant="h3" color="text.primary" fontWeight={600}>
          {valueFormatter(value)}
        </Typography>
      </Stack>

      <Box sx={{ height: 160, width: '100%' }}>
        <Line options={chartOptions} data={chartDataConfig} />
      </Box>

      <Typography variant="body2" color="text.secondary">
        <Box component="span" sx={{ color: changeColor, mr: 0.5 }}>
          {changeIcon} {Math.abs(changePercentage).toFixed(2)}%
        </Box>
        vs previous period
      </Typography>
    </Stack>
  );
};
