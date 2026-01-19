import { AddCircle, MoreHorizOutlined } from '@mui/icons-material';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';

import { CardContainer } from '~/components/ui';

const mockEmployees = [
  { id: '1', name: 'John Doe', avatar: '' },
  { id: '2', name: 'Jane Smith', avatar: '' },
  { id: '3', name: 'Bob Johnson', avatar: '' },
];

export const EmployeesOnDuty = () => {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600} color="text.primary">
          On Duty
        </Typography>
        <IconButton>
          <MoreHorizOutlined />
        </IconButton>
      </Stack>

      <CardContainer height="fit-content">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {mockEmployees.map((employee) => (
            <Stack key={employee.id} alignItems="center" spacing={0.5}>
              <Avatar src={employee.avatar} alt={employee.name} />
              <Typography variant="body1" align="center">
                {employee.name.split(' ')[0]}
              </Typography>
            </Stack>
          ))}
          <IconButton
            size="large"
            sx={{
              color: 'primary.main',
              bgcolor: 'primary.alpha',
              '&:hover': {
                bgcolor: 'primary.alpha',
              },
              '&:active': {
                bgcolor: 'primary.alpha',
              },
            }}
          >
            <AddCircle fontSize="medium" />
          </IconButton>
        </Stack>
      </CardContainer>
    </Stack>
  );
};
