import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { Link } from '~/components/ui';
import type { User } from '~/services/user/user.types';

import { MoreDetailsMenu } from './MoreDetailsMenu';

type UsersListProps = { users: User[]; onDeleteRequest: (id: string) => void };

export const UsersList = ({ users, onDeleteRequest }: UsersListProps) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', maxWidth: 560 }}>Name</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}>
              Roles
            </TableCell>
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
