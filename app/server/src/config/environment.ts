import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  MONGODB_URI: z.string().min(1),
  CLIENT_ORIGIN: z.string().url(),
  SESSION_COOKIE_NAME: z.string().min(1).default('petromate_session'),
  SESSION_ABSOLUTE_TTL_HOURS: z.coerce.number().positive().default(720),
  SESSION_IDLE_TTL_HOURS: z.coerce.number().positive().default(168),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
})

export type Environment = z.infer<typeof environmentSchema>

export function validateEnvironment(input: Record<string, unknown>): Environment {
  const result = environmentSchema.safeParse(input)

  if (!result.success) {
    throw new Error(`Invalid environment configuration: ${z.prettifyError(result.error)}`)
  }

  if (result.data.SESSION_IDLE_TTL_HOURS > result.data.SESSION_ABSOLUTE_TTL_HOURS) {
    throw new Error('SESSION_IDLE_TTL_HOURS cannot exceed SESSION_ABSOLUTE_TTL_HOURS')
  }

  return result.data
}
