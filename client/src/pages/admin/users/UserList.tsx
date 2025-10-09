import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { Link, Paper } from '~/components/ui';
import type { User } from '~/services/user/user.types';

import { MoreDetailsMenu } from './MoreDetailsMenu';

type UserListProps = { users: User[]; onDeleteRequest: (id: string) => void };

export const UserList = ({ users, onDeleteRequest }: UserListProps) => {
  return (
    <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ maxWidth: 560 }}>Name</TableCell>
            <TableCell align="left">Roles</TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map(({ id, name, role }) => (
              <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ maxWidth: 560 }}>
                  <Link to={id}>{name}</Link>
                </TableCell>
                <TableCell align="left">{role}</TableCell>
                <TableCell align="left">
                  <MoreDetailsMenu id={id} onDelete={() => onDeleteRequest(id)} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
