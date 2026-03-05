import { z } from 'zod';

export const CreateTenantSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  description: z.string().max(100).optional().nullable(),
  contact: z.string().regex(/^\d{11}$/, {
    message: 'Contact must be 11 digits',
  }),
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
    .regex(/^\d{12}$/, { message: 'PAGIBIG number must be 12 digits' })
    .optional()
    .nullable(),
  philhealth: z
    .string()
    .trim()
    .regex(/^\d{12}$/, { message: 'PhilHealth number must be 12 digits' })
    .optional()
    .nullable(),
});

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type CreateTenantPayload = CreateTenantInput & {
  createdById: string;
};
