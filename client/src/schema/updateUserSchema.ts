import z from 'zod';

import { UserRoleEnum } from '../services/user/user.types';

export const UpdateUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    contact: z
      .string()
      .regex(/^\d{11}$/, {
        message: 'Contact must be 11 digits',
      })
      .optional()
      .nullable(),
    role: z.nativeEnum(UserRoleEnum).optional(),
    email: z.string().email().optional().nullable(),
    birthday: z.date().optional().nullable(),
    address: z.string().optional().nullable(),
    position: z.string().max(30).optional().nullable(),
    tin: z
      .string()
      .trim()
      .regex(/^\d{12}$/, { message: 'TIN must be 12 digits' })
      .optional()
      .nullable(),
    sss: z
      .string()
      .trim()
      .regex(/^\d{10}$/, { message: 'SSS number must be 10 digits' })
      .optional()
      .nullable(),
    pagibig: z
      .string()
      .trim()
      .regex(/^\d{13}$/, { message: 'PAGIBIG number must be 13 digits' })
      .optional()
      .nullable(),
    philhealth: z
      .string()
      .trim()
      .regex(/^\d{12}$/, { message: 'PhilHealth number must be 12 digits' })
      .optional()
      .nullable(),
    shiftStart: z.date().optional().nullable(),
    shiftEnd: z.date().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.shiftStart && data.shiftEnd) {
        return data.shiftEnd > data.shiftStart;
      }
      return true;
    },
    {
      message: 'Shift end time must be after shift start time',
      path: ['shiftEnd'],
    },
  );

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateUserPayload = Omit<UpdateUserInput, 'role'>;
export type UpdateUserRole = Pick<UpdateUserInput, 'role'>;
