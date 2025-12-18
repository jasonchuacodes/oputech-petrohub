import { ChevronRightOutlined } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Paper } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import type { Timesheet } from '~/services/timesheet/timesheet.types';
import { pathFor } from '~/utils/pathFor';

type GroupedTimesheets = {
  userId: string;
  userName: string;
  timesheets: Timesheet[];
};

export const TimesheetTable = ({ timesheets }: { timesheets: Timesheet[] }) => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

  const handleRowClick = (userId: string) => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantTimesheets,
        params: { tenantId, userId },
      }),
    );
  };

  const groupedTimesheets = timesheets?.reduce<Record<string, GroupedTimesheets>>(
    (acc, timesheet) => {
      const key = timesheet.user.id;

      if (!acc[key]) {
        acc[key] = {
          userId: timesheet.user.id,
          userName: timesheet.user.name,
          timesheets: [],
        };
      }

      acc[key].timesheets.push(timesheet);

      return acc;
    },
    {},
  );

  const groups = Object.values(groupedTimesheets ?? {});

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ maxWidth: 240 }}>Name</TableCell>
            <TableCell align="left">Total Hours</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map(({ userId, userName, timesheets }) => {
            const totalHours = timesheets.reduce((sum, t) => sum + t.totalHours, 0);

            return (
              <TableRow
                key={userId}
                onClick={() => handleRowClick(userId)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
                  <Typography variant='body2'>{userName}</Typography>
                </TableCell>
                <TableCell align="left">{totalHours}</TableCell>
                <TableCell align="right">
                  <ChevronRightOutlined
                    fontSize="small"
                    sx={{
                      '.MuiTableRow-root:hover &': { opacity: 1 },
                      color: 'text.secondary',
                      opacity: 0.6,
                      transition: 'opacity 0.2s',
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
