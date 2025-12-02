import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { Link, Paper } from '~/components/ui';
import { UserProvider } from '~/context/user/UserContext';
import type { User } from '~/services/user/user.types';
import { toTitleCase } from '~/utils/textUtils';

import { MoreDetailsMenu } from './MoreDetailsMenu';

type UserListProps = { users: User[] };

export const UserList = ({ users }: UserListProps) => {
  return (
    <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ maxWidth: 560 }}>Name</TableCell>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left">Position</TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map(({ id, name, role, position }) => (
              <UserProvider key={id} userId={id}>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ maxWidth: 560 }}>
                    <Link to={id}>
                      <Typography variant="body2">{name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2">{toTitleCase(role)}</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2">{position || '—'}</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <MoreDetailsMenu />
                  </TableCell>
                </TableRow>
              </UserProvider>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
