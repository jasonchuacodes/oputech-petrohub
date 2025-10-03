import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  alpha,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

import { Widget } from '~/components/ui/Widget';
import theme from '~/theme';

export const UsersWidget = () => {
  const users = [
    { id: '123123', name: 'John Doe', role: 'ADMIN' },
    { id: '123123', name: 'Jane Doe', role: 'ADMIN' },
    { id: '123123', name: 'Michael Kors', role: 'USER' },
  ];

  return (
    <Widget title="Users" to="">
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
            <TableRow>
              <TableCell sx={{ maxWidth: 560 }}>Name</TableCell>
              <TableCell align="left">Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map(({ id, name, role }) => (
                <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ maxWidth: 560 }}>
                    {name}
                  </TableCell>
                  <TableCell align="left">{role}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Widget>
  );
};
