import {
  Building2,
  Box,
  CalendarClock,
  ClipboardList,
  Clock3,
  FileText,
  Fuel,
  House,
  Truck,
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

export const primaryRouteHrefs = {
  home: '/home',
  reports: '/report',
  fuelDeliveries: '/fuel-deliveries',
  timesheets: '/timesheet',
  inventory: '/inventory',
} as const

export const navigation: NavigationItem[] = [
  { label: 'Home', href: primaryRouteHrefs.home, icon: House },
  { label: 'Report', href: primaryRouteHrefs.reports, icon: ClipboardList },
  { label: 'Delivery', href: primaryRouteHrefs.fuelDeliveries, icon: Truck },
  { label: 'Timesheet', href: primaryRouteHrefs.timesheets, icon: Clock3 },
  { label: 'Me', href: '/me', icon: UserRound, activePaths: ['/account', '/tenants', '/users', '/shifts', '/fuel-setup', '/inventory', '/income-setup'] },
]

export const managementNavigation: ManagementNavigationSection[] = [
  {
    label: 'Station',
    items: [
      {
        label: 'Fuel setup',
        description: 'Configure fuel products, pumps, and tanks',
        href: '/fuel-setup',
        icon: Fuel,
      },
      {
        label: 'Delivery',
        description: 'Record deliveries and review tank readings',
        href: primaryRouteHrefs.fuelDeliveries,
        icon: Truck,
      },
      {
        label: 'Inventory',
        description: 'Manage lubricant products and stock movements',
        href: primaryRouteHrefs.inventory,
        icon: Box,
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
        icon: FileText,
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
