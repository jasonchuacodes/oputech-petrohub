import {
  Box,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { Widget } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetTenantAttendanceQuery } from '~/services/timesheet/timesheet.queries';
import { UserStatusEnum } from '~/services/timesheet/timesheet.types';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

export const AttendanceWidget = () => {
  const { tenantId } = useTenantContext();
  const { data: users = [] } = useGetTenantAttendanceQuery({ tenantId });

  const navigateTo = pathFor({
    pathname: AdminRoutes.TenantTimesheets,
    params: { tenantId },
  });

  const inUsers = users.filter((user) => user.status === UserStatusEnum.IN);
  const offlineUsers = users.filter((user) => user.status === UserStatusEnum.OUT);

  const renderStatusRow = (label: string, color: string) => (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );

  return (
    <Widget
      title="Attendance"
      to={navigateTo}
      props={{
        height: {
          xs: 720,
          md: '100%'
        },
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          height: {
            xs: '50%',
            md: '100%',
          },
          pb: {
            xs: 1,
            md: 0,
          },
        }}
      >
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
          }}
        >
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              flex: 1,
              overflowY: 'auto',
              minHeight: 0,
            }}
          >
            <Table
              stickyHeader
              sx={{
                '& td': { borderBottom: 0 },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>In ({inUsers.length})</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {inUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell scope="row" sx={{ maxWidth: 240 }}>
                      {user.name}
                    </TableCell>
                    <TableCell>{renderStatusRow(user.status, 'success.main')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <Table stickyHeader sx={{ '& td': { borderBottom: 0 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Offline ({offlineUsers.length})</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {offlineUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell scope="row" sx={{ maxWidth: 240 }}>
                      {user.name}
                    </TableCell>
                    <TableCell>{renderStatusRow(user.status, 'text.disabled')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Widget>
  );
};
