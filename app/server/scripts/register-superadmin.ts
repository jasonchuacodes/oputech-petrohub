try {
  process.loadEnvFile()
} catch (error) {
  if (!isMissingEnvironmentFile(error)) throw error
}

const args = process.argv.slice(2)

function getArgument(name: string): string | undefined {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? undefined : args[index + 1]
}

const username = getArgument('username')
const password = getArgument('password')

if (!username || !password) {
  console.error(
    'Usage: pnpm register-superadmin -- --username <username> --password <password>',
  )
  process.exit(1)
}

const apiUrl = process.env.API_URL ?? 'http://localhost:3000/api'
const secret = getScriptSecret()

function getScriptSecret(): string {
  const value = process.env.SUPERADMIN_SCRIPT_SECRET
  if (!value) {
    console.error('SUPERADMIN_SCRIPT_SECRET must be set in app/server/.env')
    process.exit(1)
  }
  return value
}

function isMissingEnvironmentFile(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  )
}

async function main(): Promise<void> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-superadmin-script-secret': secret,
      },
      body: JSON.stringify({ username, password }),
    })
  } catch {
    console.error(
      `Could not reach ${apiUrl}. Start the application with "pnpm dev" before running this command.`,
    )
    process.exit(1)
  }

  const body: unknown = await response.json()
  if (!response.ok) {
    console.error('Failed to register super admin:', body)
    process.exit(1)
  }

  console.log('Super admin registered:', body)
}

void main()
