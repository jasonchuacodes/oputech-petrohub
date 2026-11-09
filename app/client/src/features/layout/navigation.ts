import { BarChart3, ClipboardList, Clock3, Ellipsis, type LucideIcon } from 'lucide-react'

export type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const navigation: NavigationItem[] = [
  { label: 'Reports', href: '/reports', icon: ClipboardList },
  { label: 'Attendance', href: '/attendance', icon: Clock3 },
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3, adminOnly: true },
  { label: 'More', href: '/more', icon: Ellipsis },
]
