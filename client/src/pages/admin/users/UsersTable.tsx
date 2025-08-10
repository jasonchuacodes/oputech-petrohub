import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Link } from '~/components/ui';
import type { User } from '~/services/user/user.types';

import { MoreDetailsMenu } from './MoreDetailsMenu';

type UsersTableProps = { users?: User[] };

export const UsersTable = ({ users }: UsersTableProps) => {
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
          {users?.map(({ id, name, role }) => (
            <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ maxWidth: 560 }}>
                <Link to={id}>{name}</Link>
              </TableCell>
              <TableCell align="left">{role}</TableCell>
              <TableCell align="left">
                <MoreDetailsMenu id={id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
