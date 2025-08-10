import z from 'zod';

import { UserRoleEnum } from '../services/user/user.types';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  contact: z.string().regex(/^\d{11}$/, {
    message: 'Contact must be 11 digits',
  }),
  role: z.nativeEnum(UserRoleEnum),
  birthday: z.string().optional().nullable(),
  address: z.string(),
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
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
