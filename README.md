# BuzHub

**BuzHub** (rebranded to **Petromate**) is a multi-tenant business operations platform for managing employees, attendance, shift reports, inventory, payroll, and financial performance from one application.

It provides separate, role-based experiences for administrators and employees. Administrators can oversee one or more businesses, while employees can record attendance, complete operational reports, review timesheets, and access payslips.

## Capabilities

### Business and user management

- Create and manage multiple businesses (tenants) with isolated operational data.
- Add, update, and remove employees for each tenant.
- Maintain employee, employment, and government identification details.
- Assign employees to shifts and configure salary rates.
- Support administrator and employee roles with protected routes.
- Provide account security flows for login, password changes, forced password updates, and password-reset requests.

### Dashboard and analytics

- View a tenant-level overview of operational and financial performance.
- Monitor income, expenses, inventory sales, and product disposals.
- Filter dashboard metrics by preset or custom date ranges.
- Review recent reports, timesheets, and current product prices.

### Reports and financial monitoring

- Create shift-based operational reports and track them through draft, validated, and submitted states.
- Record income and expenses against each report.
- Track product readings, disposals, inventory sales, assigned employees, and report remarks.
- Review report history and inspect individual report details.
- Maintain aggregated financial data for efficient dashboard reporting.

### Products and inventory

- Manage tenant-specific products, categories, status, and low-stock thresholds.
- Maintain effective-dated product prices.
- Track stock quantities and inventory movements recorded in reports.
- Monitor product disposals and sales values from shift readings.

### Time, attendance, and shifts

- Configure shifts and assign employees to them.
- Let employees check in and out from their dashboard.
- Automatically check out open attendance sessions at the configured end-of-day time.
- Review, edit, and remove timesheet records with tenant and employee filters.

### Payroll and payslips

- Configure hourly or daily salary rates.
- Generate payroll from unprocessed timesheets.
- Review payroll runs, compensation totals, and included timesheets.
- Mark payslips as paid or cancel a payroll run.
- Give employees access to their payslip history.

### Application experience

- Responsive React interface built with Material UI.
- Installable Progressive Web App (PWA) with update prompts and API caching.
- In-app notifications with optional Pusher-powered real-time updates.
- Automatic session inactivity handling.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Material UI, TanStack Query, React Router, Chart.js |
| Backend | Node.js, Express 5, TypeScript, Zod |
| Database | PostgreSQL, Prisma ORM |
| Authentication | Cookie-based sessions, JSON Web Tokens, bcrypt |
| Real-time events | Pusher |
| Background jobs | node-cron |
| Package manager | pnpm |

## Project Structure

```text
buzhub/
├── client/   # React application
├── server/   # Express API, Prisma schema, migrations, and seeders
└── docs/     # Architecture and configuration notes
```

## Local Setup

### Prerequisites

- Node.js 20.19 or later
- pnpm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/jasonchuacodes/buzhub.git
cd buzhub
```

### 2. Configure and start the API

```bash
cd server
cp .env.example .env
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm seed # optional: load development seed data
pnpm dev
```

Update `server/.env` with your PostgreSQL connection details and a secure `JWT_SECRET`. Pusher credentials are optional unless real-time notifications are required.

The API runs at [http://localhost:8000](http://localhost:8000) by default. Set `PORT` to use a different port.

### 3. Configure and start the frontend

In a separate terminal:

```bash
cd client
cp .env.example .env
pnpm install
pnpm dev
```

Set `VITE_API_URL` in `client/.env` to the API URL. Add Pusher credentials if real-time notifications are enabled.

The frontend runs at [http://localhost:5173](http://localhost:5173) by default.

## Available Commands

Run commands from the relevant workspace directory.

| Workspace | Command | Description |
| --- | --- | --- |
| `client` | `pnpm dev` | Start the Vite development server |
| `client` | `pnpm build` | Type-check and build the frontend |
| `client` | `pnpm lint` | Run frontend linting |
| `server` | `pnpm dev` | Start the API with automatic reloads |
| `server` | `pnpm build` | Generate Prisma Client, deploy migrations, and compile the API |
| `server` | `pnpm start` | Start the compiled API |
| `server` | `pnpm seed` | Seed the database |
