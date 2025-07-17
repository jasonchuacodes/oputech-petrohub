import z from 'zod';

export const CreateTenantSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  contact: z.string().regex(/[0-9]/),
  address: z.string(),
});

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
