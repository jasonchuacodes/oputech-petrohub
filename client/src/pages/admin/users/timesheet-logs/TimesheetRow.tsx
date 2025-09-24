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

import { UpdateTimesheetSchema, type UpdateTimesheetParams } from '~/schema/updateTimesheetSchema';
import {
  TimesheetEntryActionEnum,
  TimesheetEntryActionMap,
  type Timesheet,
} from '~/services/timesheet/timesheet.types';
import theme from '~/theme';

export const TimesheetRow = ({ createdAt, entries, id, totalHours }: Timesheet) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const onSubmit = handleSubmit((data: UpdateTimesheetParams) => {
    reset();
    setEditMode(false);

    console.log('Update timesheet: ', data);
  });

  return (
    <>
      <TableRow
        key={id}
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
        <TableCell width={200}>
          {editMode ? (
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
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
              <Stack direction="row">
                <IconButton type="submit" disabled={!isValid} size="small">
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
            `${totalHours.toFixed(2)} hrs`
          )}
        </TableCell>

        <TableCell>
          {!editMode && (
            <IconButton onClick={() => setEditMode(true)} size="small">
              <EditOutlined fontSize="inherit" />
            </IconButton>
          )}

          <IconButton onClick={() => null} size="small">
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
              <Typography variant="body1">Timesheet entries:</Typography>
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

      {/* TODO: Delete Timesheet Confirmation modal */}
    </>
  );
};
