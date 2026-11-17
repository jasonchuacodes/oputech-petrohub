'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import {
  myAttendanceQueryOptions,
  timesheetDaysQueryOptions,
  timesheetsQueryOptions,
} from '../attendance/attendance.queries'
import { userTimesheetHref, type TimesheetDateRange } from '../attendance/attendance-route'
import { fuelDeliveriesInput, fuelDeliveriesQueryOptions } from '../fuel-deliveries/fuel-deliveries.queries'
import { inventoryProductsInput, inventoryProductsQueryOptions } from '../inventory/inventory.queries'
import { currentReportMonth } from '../reports/report-date-range'
import {
  financialSummaryQueryOptions,
  reportCreationContextQueryOptions,
  reportQueryOptions,
  reportsPageInput,
  reportsQueryOptions,
  submittedReportsInput,
} from '../reports/reports.queries'
import { fuelSetupQueryOptions } from '../tenants/fuel-setup.queries'
import type { TenantAccess } from '../tenants/tenants.queries'
import { UserRole } from '../users/user-role'
import { currentFinancialRange, localDateFor } from '../dashboard/admin-home/financial-range'
import { primaryRouteHrefs } from './navigation'

const primaryRoutes = new Set<string>(Object.values(primaryRouteHrefs))

export function usePrimaryRoutePrefetch(access: TenantAccess | undefined, userId: string | undefined) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useCallback((href: string) => {
    const pathname = href.split('?')[0]
    if (!access || !primaryRoutes.has(pathname)) return

    router.prefetch(href)
    const { tenant, role } = access

    if (pathname === primaryRouteHrefs.home) {
      if (role === UserRole.Member) {
        void queryClient.prefetchQuery(reportCreationContextQueryOptions(tenant.id))
        void queryClient.prefetchQuery(myAttendanceQueryOptions(tenant.id))
        return
      }

      const financialRange = currentFinancialRange('monthly', tenant.timezone)
      const today = localDateFor(tenant.timezone)
      void queryClient.prefetchQuery(fuelSetupQueryOptions(tenant.id))
      void queryClient.prefetchQuery(financialSummaryQueryOptions(tenant.id, {
        startDate: financialRange.startDate,
        endDate: financialRange.endDate,
      }))
      void queryClient.prefetchQuery(reportsQueryOptions(tenant.id, submittedReportsInput(today)))
      return
    }

    if (pathname === primaryRouteHrefs.reports) {
      const range = currentReportMonth(tenant.timezone)
      const administrator = role === UserRole.Admin || role === UserRole.Superadmin
      void queryClient.prefetchQuery(reportsQueryOptions(
        tenant.id,
        reportsPageInput(range, administrator),
      ))
      return
    }

    if (pathname === primaryRouteHrefs.timesheets) {
      const memberId = role === UserRole.Member ? userId : undefined
      if (role === UserRole.Member && !memberId) return
      void queryClient.prefetchQuery(timesheetsQueryOptions(
        tenant.id,
        undefined,
        undefined,
        memberId,
        0,
      ))
      return
    }

    if (pathname === primaryRouteHrefs.inventory) {
      void queryClient.prefetchQuery(inventoryProductsQueryOptions(
        tenant.id,
        inventoryProductsInput(),
      ))
      return
    }

    void queryClient.prefetchQuery(fuelSetupQueryOptions(tenant.id))
    void queryClient.prefetchQuery(fuelDeliveriesQueryOptions(tenant.id, fuelDeliveriesInput()))
  }, [access, queryClient, router, userId])
}

export function useReportDetailPrefetch(tenantId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useCallback((reportId: string) => {
    router.prefetch(`/report/${reportId}`)
    void queryClient.prefetchQuery(reportQueryOptions(tenantId, reportId))
  }, [queryClient, router, tenantId])
}

export function useTimesheetDetailPrefetch(tenantId: string, range: TimesheetDateRange | undefined) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useCallback((userId: string) => {
    router.prefetch(userTimesheetHref(userId, range))
    void queryClient.prefetchQuery(timesheetsQueryOptions(
      tenantId,
      range?.startDate,
      range?.endDate,
      userId,
      0,
    ))
    if (range) {
      void queryClient.prefetchQuery(timesheetDaysQueryOptions(
        tenantId,
        userId,
        range.startDate,
        range.endDate,
      ))
    }
  }, [queryClient, range, router, tenantId])
}
