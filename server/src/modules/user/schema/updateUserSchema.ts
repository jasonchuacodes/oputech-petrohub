import z from 'zod';

import { Role } from '@prisma';

export const UpdateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  contact: z
    .string()
    .regex(/^\d{11}$/, {
      message: 'Contact must be 11 digits',
    })
    .optional()
    .nullable(),
  role: z.nativeEnum(Role).optional(),
  birthday: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
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
export type UpdateUserPayload = Omit<UpdateUserInput, 'role'>;
export type UpdateUserRole = Pick<UpdateUserInput, 'role'>;
