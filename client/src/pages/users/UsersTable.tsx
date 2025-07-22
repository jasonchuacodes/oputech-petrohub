import { MoreHorizOutlined } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Button } from '~/components/ui';
import { userData } from '~/data/mockUsers';

export const UsersTable = () => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', width: 560 }}>Name</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}>
              Roles
            </TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map(({ id, name, role }) => (
            <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ width: 560 }}>
                {name}
              </TableCell>
              <TableCell align="left">{role}</TableCell>
              <TableCell align="left">
                <Button size="small" variant="outlined" sx={{ height: 24, minWidth: 24 }}>
                  <MoreHorizOutlined fontSize="inherit" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
