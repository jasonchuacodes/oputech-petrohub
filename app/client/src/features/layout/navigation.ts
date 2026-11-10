import { ClipboardList, Clock3, House, UserRound, type LucideIcon } from 'lucide-react'

export type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  activePaths?: string[]
}

export const navigation: NavigationItem[] = [
  { label: 'Home', href: '/home', icon: House },
  { label: 'Report', href: '/report', icon: ClipboardList },
  { label: 'Timesheet', href: '/timesheet', icon: Clock3 },
  { label: 'Me', href: '/me', icon: UserRound, activePaths: ['/account', '/tenants', '/users'] },
]
