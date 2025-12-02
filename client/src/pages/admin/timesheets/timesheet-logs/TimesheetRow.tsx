import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckOutlined,
  ChevronRightOutlined,
  CloseOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
} from '@mui/icons-material';
import {
  alpha,
  Collapse,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useTenantContext } from '~/context/tenant/useTenantContext';
import { UpdateTimesheetSchema, type UpdateTimesheetParams } from '~/schema/updateTimesheetSchema';
import {
  useDeleteTimesheetMutation,
  useUpdateTimesheetMutation,
} from '~/services/timesheet/timesheet.queries';
import {
  TimesheetEntryActionEnum,
  TimesheetEntryActionMap,
  type Timesheet,
} from '~/services/timesheet/timesheet.types';
import theme from '~/theme';
import { parseBackendError } from '~/utils/parseBackendError';

import { DeleteConfirmModal } from './DeleteConfirmModal';

export const TimesheetRow = ({ createdAt, entries, id: timesheetId, totalHours }: Timesheet) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const firstCheckIn = entries.find((e) => e.action === TimesheetEntryActionEnum.CHECK_IN);

  const lastCheckOut = [...entries]
    .reverse()
    .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);

  const {
    register,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<UpdateTimesheetParams>({
    defaultValues: {
      totalHours,
    },
    resolver: zodResolver(UpdateTimesheetSchema),
  });

  const { tenantId } = useTenantContext();

  const { mutate: updateTimesheet, isPending: isUpdateTimesheetPending } =
    useUpdateTimesheetMutation();

  const { mutateAsync: deleteTimesheet, isPending: isDeletePending } =
    useDeleteTimesheetMutation();

  const onSubmit = handleSubmit(({ totalHours }: UpdateTimesheetParams) => {
    updateTimesheet(
      {
        timesheetId,
        totalHours,
      },
      {
        onSuccess: () => {
          toast.success('Successfully updated timesheet');
          reset();
          setEditMode(false);
        },
        onError: (err) => {
          const parsedErr = parseBackendError(err);
          toast.error(`Faield to update timesheet: ${parsedErr}`);
        },
      },
    );
  });

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTimesheet({ timesheetId, tenantId });
      toast.success('Successfully deleted timesheet');
    } catch (err) {
      const parsedErr = parseBackendError(err);
      toast.error(`Failed to delete timesheet: ${parsedErr}`);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <TableRow
        key={timesheetId}
        sx={{
          height: 80,
          '&:last-child td, &:last-child th': { border: 0 },
        }}
      >
        <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
          {dayjs(createdAt).format('MMMM DD, YYYY')}
        </TableCell>
        <TableCell align="left">
          <Tooltip title="First In">
            <Typography variant="body2">
              {firstCheckIn ? dayjs(firstCheckIn.timestamp).format('hh:mm A') : '—'}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="left">
          <Tooltip title="Last Out">
            <Typography variant="body2">
              {lastCheckOut ? dayjs(lastCheckOut.timestamp).format('hh:mm A') : '—'}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" sx={{ minWidth: 180 }}>
            {editMode ? (
              <form
                onSubmit={onSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <input
                  {...register('totalHours', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  max={16.0}
                  step="any"
                  placeholder="0.00"
                  style={{
                    width: 80,
                    height: 32,
                    padding: '4px 8px',
                    border: '1px solid',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <Stack direction="row" marginLeft={1}>
                  <IconButton
                    type="submit"
                    disabled={!isValid || isUpdateTimesheetPending}
                    size="small"
                  >
                    <CheckOutlined fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset();
                      setEditMode(false);
                    }}
                    size="small"
                  >
                    <CloseOutlined fontSize="inherit" />
                  </IconButton>
                </Stack>
              </form>
            ) : (
              <Typography variant="body2">{`${totalHours.toFixed(2)} hrs`}</Typography>
            )}
          </Stack>
        </TableCell>

        <TableCell>
          {!editMode && (
            <IconButton onClick={() => setEditMode(true)} size="small">
              <EditOutlined fontSize="inherit" />
            </IconButton>
          )}

          <IconButton onClick={handleDelete} size="small">
            <DeleteOutlineOutlined fontSize="inherit" />
          </IconButton>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={() => setOpen(!open)} size="small">
            <ChevronRightOutlined fontSize="small" sx={{ rotate: '90deg' }} />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Timesheet Entries */}
      <TableRow
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: 0,
          '&:last-child td, &:last-child th': { border: 0 },
        }}
      >
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack margin={1} spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Timesheet entries:
              </Typography>
              {entries.map(({ id, timestamp, action }) => {
                return (
                  <Stack key={id} direction="row" spacing={2} paddingLeft={2}>
                    <Typography variant="body2">{dayjs(timestamp).format('hh:mm:ss A')}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>&mdash;</Typography>
                    <Typography variant="body2">{TimesheetEntryActionMap[action]}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        loading={isDeletePending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
