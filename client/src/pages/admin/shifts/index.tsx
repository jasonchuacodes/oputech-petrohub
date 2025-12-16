import {
  Container,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Schedule } from '@mui/icons-material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { PageLayout } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetShiftsQuery, useDeleteShiftMutation } from '~/services/shift/shift.queries';
import type { Shift } from '~/services/shift/shift.types';
import { CreateShiftModal } from './CreateShiftModal';
import { EditShiftModal } from './EditShiftModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const ShiftsPage = () => {
  const { tenantId } = useTenantContext();
  const { data: shifts, isLoading } = useGetShiftsQuery(tenantId);
  const { mutateAsync: deleteShift } = useDeleteShiftMutation();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const handleDelete = async () => {
    if (!selectedShift || !tenantId) return;
    try {
      await deleteShift({ shiftId: selectedShift.id, tenantId });
      toast.success('Shift deleted successfully');
      setDeleteModalOpen(false);
    } catch {
      toast.error('Failed to delete shift');
    }
  };

  return (
    <PageLayout p={3}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Shift Management</Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setCreateModalOpen(true)}
            >
              Create Shift
            </Button>
          </Stack>

          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={2}>
              {shifts?.map((shift) => (
                <Grid size={{ xs: 12, md: 6 }} key={shift.id}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Stack spacing={1}>
                          <Typography variant="h6">{shift.name}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(shift.shiftStart).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(shift.shiftEnd).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {shift._count?.users || 0} users assigned
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedShift(shift);
                              setEditModalOpen(true);
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedShift(shift);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>

      <CreateShiftModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <EditShiftModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        shift={selectedShift}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        shiftName={selectedShift?.name || ''}
        userCount={selectedShift?._count?.users || 0}
      />
    </PageLayout>
  );
};
