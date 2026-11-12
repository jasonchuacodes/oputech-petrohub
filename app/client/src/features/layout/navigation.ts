import {
  Boxes,
  Building2,
  CalendarClock,
  ClipboardList,
  Clock3,
  Fuel,
  HandCoins,
  House,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  activePaths?: string[]
}

export type ManagementNavigationItem = NavigationItem & {
  description: string
}

export type ManagementNavigationSection = {
  label: string
  items: ManagementNavigationItem[]
}

export const navigation: NavigationItem[] = [
  { label: 'Home', href: '/home', icon: House },
  { label: 'Report', href: '/report', icon: ClipboardList },
  { label: 'Timesheet', href: '/timesheet', icon: Clock3 },
  { label: 'Me', href: '/me', icon: UserRound, activePaths: ['/account', '/tenants', '/users', '/shifts', '/fuel-setup', '/inventory', '/income-setup'] },
]

export const desktopNavigation = navigation.filter((item) => item.href !== '/me')

export const managementNavigation: ManagementNavigationSection[] = [
  {
    label: 'Station',
    items: [
      {
        label: 'Fuel setup',
        description: 'Configure fuel prices and pump meter baselines',
        href: '/fuel-setup',
        icon: Fuel,
      },
      {
        label: 'Inventory',
        description: 'Manage lubricant products and stock movements',
        href: '/inventory',
        icon: Boxes,
      },
      {
        label: 'Shifts',
        description: 'Configure the daily shift schedule',
        href: '/shifts',
        icon: CalendarClock,
      },
      {
        label: 'Report setup',
        description: 'Configure income fields for new reports',
        href: '/income-setup',
        icon: HandCoins,
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        label: 'Users',
        description: 'Manage users, roles, and station access',
        href: '/users',
        icon: Users,
      },
      {
        label: 'Tenants',
        description: 'Manage workspaces and choose the active station',
        href: '/tenants',
        icon: Building2,
      },
    ],
  },
]
