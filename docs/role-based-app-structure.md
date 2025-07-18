# Role-Based App Structure Using React Router

This document outlines a scalable, maintainable strategy for implementing role-based UI in a React app using **React Router v6.4+**, where the user's role (e.g., `ADMIN` or `USER`) is determined by the `/me` endpoint.

## 🎯 Goal

- Use a **single entry route** (e.g., `/dashboard`) regardless of role
- Avoid exposing roles in URLs (e.g., no `/admin/dashboard`)
- Render completely different UIs based on role
- Keep the codebase modular and maintainable as the app grows

---

## 🧱 Core Concept

Use a shared route like `/dashboard`, but dynamically render either:

- `<AdminApp />` for `ADMIN` users
- `<UserApp />` for `USER` users

Each of these components will:
- Have its own layout (`AdminLayout`, `UserLayout`)
- Define its own nested routes using `useRoutes()`

---

## 📁 Folder Structure (Example)

```
src/
├─ router/
│  └─ index.ts                # Single createBrowserRouter
├─ layouts/
│  ├─ AdminLayout.tsx
│  └─ UserLayout.tsx
├─ apps/
│  ├─ AdminApp.tsx            # Routes and layout for ADMIN role
│  └─ UserApp.tsx             # Routes and layout for USER role
├─ pages/
│  ├─ admin/
│  │  ├─ Dashboard.tsx
│  │  └─ UserManagement.tsx
│  ├─ user/
│  │  ├─ Dashboard.tsx
│  │  └─ TimeLogger.tsx
│  └─ CommonPage.tsx
├─ hooks/
│  └─ useAuth.ts              # Wraps the /me query
└─ App.tsx
```

---

## 🔄 Role-Based Routing Entry Point

### `RoleBasedDashboard.tsx`

```tsx
import { useAuth } from '../hooks/useAuth'
import AdminApp from '../apps/AdminApp'
import UserApp from '../apps/UserApp'

export default function RoleBasedDashboard() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Loading />
  if (!user) return <Redirect to="/login" />

  if (user.role === 'ADMIN') return <AdminApp />
  if (user.role === 'USER') return <UserApp />

  return <Forbidden />
}
```

---

## 🔧 Global Router Setup

### `router/index.ts`

```tsx
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import RoleBasedDashboard from '../RoleBasedDashboard'
import CommonPage from '../pages/CommonPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'dashboard/*', element: <RoleBasedDashboard /> },
      { path: 'profile', element: <CommonPage /> },
    ]
  }
])

export default router
```

---

## 🧩 Role-Specific Apps

### `apps/AdminApp.tsx`

```tsx
import { useRoutes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import UserManagement from '../pages/admin/UserManagement'

export default function AdminApp() {
  const routes = useRoutes([
    { path: '', element: <AdminDashboard /> },
    { path: 'users', element: <UserManagement /> },
  ])

  return <AdminLayout>{routes}</AdminLayout>
}
```

### `apps/UserApp.tsx`

```tsx
import { useRoutes } from 'react-router-dom'
import UserLayout from '../layouts/UserLayout'
import UserDashboard from '../pages/user/Dashboard'
import TimeLogger from '../pages/user/TimeLogger'

export default function UserApp() {
  const routes = useRoutes([
    { path: '', element: <UserDashboard /> },
    { path: 'timelog', element: <TimeLogger /> },
  ])

  return <UserLayout>{routes}</UserLayout>
}
```

---

## 🧠 `useAuth` Hook Example

```tsx
import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api/auth'

export function useAuth() {
  const { data: user, isLoading } = useQuery(['/me'], getMe)
  return {
    user,
    isLoading,
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',
  }
}
```

---

## ✅ Benefits of This Approach

- 🧼 **Clean URLs** – no role leakage like `/admin/dashboard`
- 🔁 **Single router config** – easy to maintain
- 🧩 **Fully modular apps per role** – scale independently
- 🚀 **Code splitting friendly** – lazy-load each app if needed
- 🔐 **Secure** – backend must still enforce role-based access

---

Let me know if you want a Next.js App Router version or SSR-friendly variant.