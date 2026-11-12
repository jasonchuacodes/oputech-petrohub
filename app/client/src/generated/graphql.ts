/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CheckInAttendanceInput = {
  idempotencyKey: string;
};

export type CheckOutAttendanceInput = {
  sessionId: string;
};

export type CreateFuelProductInput = {
  name: string;
  unitPrice: string;
};

export type CreateInventoryProductInput = {
  idempotencyKey: string;
  name: string;
  openingStock: string;
  unit: string;
  unitPrice: string;
};

export type CreatePumpMeterInput = {
  initialReading: string;
  label: string;
  productId: string;
};

export type CreateReportInput = {
  businessDate: string;
  shiftId: string;
};

export type CreateShiftInput = {
  endTime: string;
  startTime: string;
};

export type CreateTenantInput = {
  name: string;
};

export type CreateUserInput = {
  password: string;
  role?: UserRole | null | undefined;
  username: string;
};

export type DeactivateFuelSetupInput = {
  expectedRevision: number;
  id: string;
};

export type DeactivateInventoryProductInput = {
  expectedRevision: number;
  productId: string;
};

export type DeleteReportInput = {
  expectedDisposalRevision: number;
  expectedReportRevision: number;
  reason: string;
  reportId: string;
};

export type DeleteShiftInput = {
  shiftId: string;
};

export type DeleteTenantInput = {
  tenantId: string;
};

export type DeleteUserInput = {
  userId: string;
};

export type DisposalBatchStatus =
  | 'draft'
  | 'revoked'
  | 'submitted';

export type DisposalOpeningSource =
  | 'baseline'
  | 'previous_report';

export type EditableDisposalInput = {
  calibration: string;
  closingReading?: string | null | undefined;
  meterId: string;
};

export type FinancialEntryInput = {
  amount: string;
  description: string;
  id: string;
  notes?: string | null | undefined;
};

export type FuelSetupStatus =
  | 'active'
  | 'inactive';

export type InventoryProductStatus =
  | 'active'
  | 'inactive';

export type InventoryProductsInput = {
  activeOnly?: boolean | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  search?: string | null | undefined;
};

export type LubricantSaleInput = {
  id: string;
  productId: string;
  quantity: string;
};

export type ManualStockMovementType =
  | 'stock_in'
  | 'stock_out';

export type RecordStockMovementInput = {
  idempotencyKey: string;
  productId: string;
  quantity: string;
  reason: string;
  type: ManualStockMovementType;
};

export type RecurringIncomeFieldInput = {
  active: boolean;
  description: string;
  id?: string | null | undefined;
};

export type ReportInput = {
  reportId: string;
};

export type ReportStatus =
  | 'draft'
  | 'revoked'
  | 'submitted';

export type ReportTransitionInput = {
  expectedDisposalRevision: number;
  expectedReportRevision: number;
  reportId: string;
};

export type ReportsInput = {
  endDate?: string | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  startDate?: string | null | undefined;
  submittedOnly?: boolean | null | undefined;
};

export type ResetUserPasswordInput = {
  newPassword: string;
  userId: string;
};

export type SaveReportDraftInput = {
  disposalReadings: Array<EditableDisposalInput>;
  expectedDisposalRevision: number;
  expectedReportRevision: number;
  expenseEntries: Array<FinancialEntryInput>;
  incomeEntries: Array<FinancialEntryInput>;
  lubricantSales?: Array<LubricantSaleInput> | null | undefined;
  reportId: string;
};

export type SetTimesheetDayOverrideInput = {
  expectedRevision: number;
  localDate: string;
  overrideHours?: string | null | undefined;
  userId: string;
};

export type StockMovementType =
  | 'opening'
  | 'report_reversal'
  | 'report_sale'
  | 'stock_in'
  | 'stock_out';

export type StockMovementsInput = {
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  productId: string;
};

export type TimesheetDaysFilter = {
  endDate: string;
  startDate: string;
  userId: string;
};

export type TimesheetsFilter = {
  endDate?: string | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  startDate?: string | null | undefined;
  userId?: string | null | undefined;
};

export type UpdateFuelProductInput = {
  expectedRevision: number;
  name: string;
  productId: string;
  unitPrice: string;
};

export type UpdateInventoryProductInput = {
  expectedRevision: number;
  name: string;
  productId: string;
  unit: string;
  unitPrice: string;
};

export type UpdateMyProfileInput = {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
};

export type UpdatePumpMeterInput = {
  expectedRevision: number;
  label: string;
  meterId: string;
};

export type UpdateRecurringIncomeConfigurationInput = {
  expectedRevision: number;
  fields: Array<RecurringIncomeFieldInput>;
};

export type UpdateShiftInput = {
  endTime: string;
  shiftId: string;
  startTime: string;
};

export type UpdateTenantInput = {
  name: string;
  tenantId: string;
};

export type UpdateUserInput = {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  role: UserRole;
  userId: string;
  username: string;
};

export type UserRole =
  | 'admin'
  | 'member'
  | 'superadmin';

export type UserStatus =
  | 'active'
  | 'disabled';

export type UsersInput = {
  limit?: number | null | undefined;
  offset?: number | null | undefined;
};

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileInput;
}>;


export type UpdateMyProfileMutation = { updateMyProfile: { firstName: string | null, lastName: string | null, fullName: string } };

export type AttendanceStatusFieldsFragment = { localDate: string, timezone: string, asOf: string, trackedSeconds: number, automaticSeconds: number, activeSession: { id: string, startedAt: string } | null };

export type TimesheetDayFieldsFragment = { localDate: string, trackedSeconds: number, automaticSeconds: number, overrideHours: string | null, effectiveHours: string, revision: number };

export type MyAttendanceQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAttendanceQuery = { myAttendance: { localDate: string, timezone: string, asOf: string, trackedSeconds: number, automaticSeconds: number, activeSession: { id: string, startedAt: string } | null } };

export type CheckInAttendanceMutationVariables = Exact<{
  input: CheckInAttendanceInput;
}>;


export type CheckInAttendanceMutation = { checkInAttendance: { localDate: string, timezone: string, asOf: string, trackedSeconds: number, automaticSeconds: number, activeSession: { id: string, startedAt: string } | null } };

export type CheckOutAttendanceMutationVariables = Exact<{
  input: CheckOutAttendanceInput;
}>;


export type CheckOutAttendanceMutation = { checkOutAttendance: { localDate: string, timezone: string, asOf: string, trackedSeconds: number, automaticSeconds: number, activeSession: { id: string, startedAt: string } | null } };

export type TimesheetsQueryVariables = Exact<{
  filter: TimesheetsFilter;
}>;


export type TimesheetsQuery = { timesheets: { startDate: string, endDate: string, timezone: string, asOf: string, totalCount: number, items: Array<{ userId: string, fullName: string, username: string, totalHours: string }> } };

export type TimesheetDaysQueryVariables = Exact<{
  filter: TimesheetDaysFilter;
}>;


export type TimesheetDaysQuery = { timesheetDays: { userId: string, fullName: string, username: string, days: Array<{ localDate: string, trackedSeconds: number, automaticSeconds: number, overrideHours: string | null, effectiveHours: string, revision: number }> } };

export type SetTimesheetDayOverrideMutationVariables = Exact<{
  input: SetTimesheetDayOverrideInput;
}>;


export type SetTimesheetDayOverrideMutation = { setTimesheetDayOverride: { localDate: string, trackedSeconds: number, automaticSeconds: number, overrideHours: string | null, effectiveHours: string, revision: number } };

export type InventoryProductFieldsFragment = { id: string, name: string, unit: string, unitPrice: string, stockCount: string, status: InventoryProductStatus, revision: number };

export type StockMovementFieldsFragment = { id: string, productId: string, productName: string, unit: string, type: StockMovementType, quantityChange: string, balanceBefore: string, balanceAfter: string, reason: string | null, actorName: string, reportId: string | null, createdAt: string };

export type InventoryProductsQueryVariables = Exact<{
  input: InventoryProductsInput;
}>;


export type InventoryProductsQuery = { inventoryProducts: { totalCount: number, items: Array<{ id: string, name: string, unit: string, unitPrice: string, stockCount: string, status: InventoryProductStatus, revision: number }> } };

export type StockMovementsQueryVariables = Exact<{
  input: StockMovementsInput;
}>;


export type StockMovementsQuery = { stockMovements: { totalCount: number, items: Array<{ id: string, productId: string, productName: string, unit: string, type: StockMovementType, quantityChange: string, balanceBefore: string, balanceAfter: string, reason: string | null, actorName: string, reportId: string | null, createdAt: string }> } };

export type CreateInventoryProductMutationVariables = Exact<{
  input: CreateInventoryProductInput;
}>;


export type CreateInventoryProductMutation = { createInventoryProduct: { id: string, name: string, unit: string, unitPrice: string, stockCount: string, status: InventoryProductStatus, revision: number } };

export type UpdateInventoryProductMutationVariables = Exact<{
  input: UpdateInventoryProductInput;
}>;


export type UpdateInventoryProductMutation = { updateInventoryProduct: { id: string, name: string, unit: string, unitPrice: string, stockCount: string, status: InventoryProductStatus, revision: number } };

export type DeactivateInventoryProductMutationVariables = Exact<{
  input: DeactivateInventoryProductInput;
}>;


export type DeactivateInventoryProductMutation = { deactivateInventoryProduct: { id: string, name: string, unit: string, unitPrice: string, stockCount: string, status: InventoryProductStatus, revision: number } };

export type RecordStockMovementMutationVariables = Exact<{
  input: RecordStockMovementInput;
}>;


export type RecordStockMovementMutation = { recordStockMovement: { id: string, productId: string, productName: string, unit: string, type: StockMovementType, quantityChange: string, balanceBefore: string, balanceAfter: string, reason: string | null, actorName: string, reportId: string | null, createdAt: string } };

export type ReportFieldsFragment = { id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, interval: { startTime: string, endTime: string, timezone: string } };

export type ReportDetailFieldsFragment = { currency: string, legacy: boolean, effective: boolean, revokedFromStatus: ReportStatus | null, revokedById: string | null, id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, incomeEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, expenseEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, lubricantSales: Array<{ id: string, productId: string, productName: string, unit: string, quantity: string, unitPrice: string, amount: string }>, totals: { income: string, expenses: string, cashFuelSales: string, pumpSales: string | null, overShort: string | null, lubricantSales: string }, disposals: { id: string, revision: number, status: DisposalBatchStatus, predecessorBatchId: string | null, successorBatchId: string | null, pumpSales: string | null, complete: boolean, blockingIssues: Array<string>, readings: Array<{ meterId: string, meterLabel: string, productId: string, productName: string, unitPrice: string, openingReading: string, openingSource: DisposalOpeningSource, closingReading: string | null, calibration: string, netVolume: string | null, sales: string | null }> } | null, interval: { startTime: string, endTime: string, timezone: string } };

export type ReportCreationContextQueryVariables = Exact<{ [key: string]: never; }>;


export type ReportCreationContextQuery = { reportCreationContext: { businessDate: string, slots: Array<{ canCreate: boolean, blockedReason: string | null, shift: { id: string, startTime: string, endTime: string }, report: { id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, interval: { startTime: string, endTime: string, timezone: string } } | null }> } };

export type ReportsQueryVariables = Exact<{
  input: ReportsInput;
}>;


export type ReportsQuery = { reports: { totalCount: number, items: Array<{ currency: string, effective: boolean, id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, totals: { income: string, expenses: string, cashFuelSales: string, pumpSales: string | null, overShort: string | null, lubricantSales: string }, interval: { startTime: string, endTime: string, timezone: string } }> } };

export type ReportQueryVariables = Exact<{
  input: ReportInput;
}>;


export type ReportQuery = { report: { currency: string, legacy: boolean, effective: boolean, revokedFromStatus: ReportStatus | null, revokedById: string | null, id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, incomeEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, expenseEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, lubricantSales: Array<{ id: string, productId: string, productName: string, unit: string, quantity: string, unitPrice: string, amount: string }>, totals: { income: string, expenses: string, cashFuelSales: string, pumpSales: string | null, overShort: string | null, lubricantSales: string }, disposals: { id: string, revision: number, status: DisposalBatchStatus, predecessorBatchId: string | null, successorBatchId: string | null, pumpSales: string | null, complete: boolean, blockingIssues: Array<string>, readings: Array<{ meterId: string, meterLabel: string, productId: string, productName: string, unitPrice: string, openingReading: string, openingSource: DisposalOpeningSource, closingReading: string | null, calibration: string, netVolume: string | null, sales: string | null }> } | null, interval: { startTime: string, endTime: string, timezone: string } } };

export type CreateReportMutationVariables = Exact<{
  input: CreateReportInput;
}>;


export type CreateReportMutation = { createReport: { created: boolean, report: { currency: string, legacy: boolean, effective: boolean, revokedFromStatus: ReportStatus | null, revokedById: string | null, id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, incomeEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, expenseEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, lubricantSales: Array<{ id: string, productId: string, productName: string, unit: string, quantity: string, unitPrice: string, amount: string }>, totals: { income: string, expenses: string, cashFuelSales: string, pumpSales: string | null, overShort: string | null, lubricantSales: string }, disposals: { id: string, revision: number, status: DisposalBatchStatus, predecessorBatchId: string | null, successorBatchId: string | null, pumpSales: string | null, complete: boolean, blockingIssues: Array<string>, readings: Array<{ meterId: string, meterLabel: string, productId: string, productName: string, unitPrice: string, openingReading: string, openingSource: DisposalOpeningSource, closingReading: string | null, calibration: string, netVolume: string | null, sales: string | null }> } | null, interval: { startTime: string, endTime: string, timezone: string } } } };

export type SaveReportDraftMutationVariables = Exact<{
  input: SaveReportDraftInput;
}>;


export type SaveReportDraftMutation = { saveReportDraft: { currency: string, legacy: boolean, effective: boolean, revokedFromStatus: ReportStatus | null, revokedById: string | null, id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, incomeEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, expenseEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, lubricantSales: Array<{ id: string, productId: string, productName: string, unit: string, quantity: string, unitPrice: string, amount: string }>, totals: { income: string, expenses: string, cashFuelSales: string, pumpSales: string | null, overShort: string | null, lubricantSales: string }, disposals: { id: string, revision: number, status: DisposalBatchStatus, predecessorBatchId: string | null, successorBatchId: string | null, pumpSales: string | null, complete: boolean, blockingIssues: Array<string>, readings: Array<{ meterId: string, meterLabel: string, productId: string, productName: string, unitPrice: string, openingReading: string, openingSource: DisposalOpeningSource, closingReading: string | null, calibration: string, netVolume: string | null, sales: string | null }> } | null, interval: { startTime: string, endTime: string, timezone: string } } };

export type SubmitReportMutationVariables = Exact<{
  input: ReportTransitionInput;
}>;


export type SubmitReportMutation = { submitReport: { currency: string, legacy: boolean, effective: boolean, revokedFromStatus: ReportStatus | null, revokedById: string | null, id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, incomeEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, expenseEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, lubricantSales: Array<{ id: string, productId: string, productName: string, unit: string, quantity: string, unitPrice: string, amount: string }>, totals: { income: string, expenses: string, cashFuelSales: string, pumpSales: string | null, overShort: string | null, lubricantSales: string }, disposals: { id: string, revision: number, status: DisposalBatchStatus, predecessorBatchId: string | null, successorBatchId: string | null, pumpSales: string | null, complete: boolean, blockingIssues: Array<string>, readings: Array<{ meterId: string, meterLabel: string, productId: string, productName: string, unitPrice: string, openingReading: string, openingSource: DisposalOpeningSource, closingReading: string | null, calibration: string, netVolume: string | null, sales: string | null }> } | null, interval: { startTime: string, endTime: string, timezone: string } } };

export type DeleteReportMutationVariables = Exact<{
  input: DeleteReportInput;
}>;


export type DeleteReportMutation = { deleteReport: { currency: string, legacy: boolean, effective: boolean, revokedFromStatus: ReportStatus | null, revokedById: string | null, id: string, businessDate: string, shiftId: string, creatorId: string, creatorName: string, status: ReportStatus, revision: number, createdAt: string, updatedAt: string, submittedAt: string | null, submittedById: string | null, submittedByName: string | null, revokedAt: string | null, revokedByName: string | null, revocationReason: string | null, incomeEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, expenseEntries: Array<{ id: string, recurringIncomeFieldId: string | null, description: string, notes: string | null, amount: string }>, lubricantSales: Array<{ id: string, productId: string, productName: string, unit: string, quantity: string, unitPrice: string, amount: string }>, totals: { income: string, expenses: string, cashFuelSales: string, pumpSales: string | null, overShort: string | null, lubricantSales: string }, disposals: { id: string, revision: number, status: DisposalBatchStatus, predecessorBatchId: string | null, successorBatchId: string | null, pumpSales: string | null, complete: boolean, blockingIssues: Array<string>, readings: Array<{ meterId: string, meterLabel: string, productId: string, productName: string, unitPrice: string, openingReading: string, openingSource: DisposalOpeningSource, closingReading: string | null, calibration: string, netVolume: string | null, sales: string | null }> } | null, interval: { startTime: string, endTime: string, timezone: string } } };

export type FuelProductFieldsFragment = { id: string, name: string, unitPrice: string, status: FuelSetupStatus, revision: number };

export type PumpMeterFieldsFragment = { id: string, label: string, productId: string, initialReading: string, currentReading: string, status: FuelSetupStatus, revision: number };

export type FuelSetupQueryVariables = Exact<{ [key: string]: never; }>;


export type FuelSetupQuery = { fuelSetup: { products: Array<{ id: string, name: string, unitPrice: string, status: FuelSetupStatus, revision: number }>, meters: Array<{ id: string, label: string, productId: string, initialReading: string, currentReading: string, status: FuelSetupStatus, revision: number }> } };

export type CreateFuelProductMutationVariables = Exact<{
  input: CreateFuelProductInput;
}>;


export type CreateFuelProductMutation = { createFuelProduct: { id: string, name: string, unitPrice: string, status: FuelSetupStatus, revision: number } };

export type UpdateFuelProductMutationVariables = Exact<{
  input: UpdateFuelProductInput;
}>;


export type UpdateFuelProductMutation = { updateFuelProduct: { id: string, name: string, unitPrice: string, status: FuelSetupStatus, revision: number } };

export type DeactivateFuelProductMutationVariables = Exact<{
  input: DeactivateFuelSetupInput;
}>;


export type DeactivateFuelProductMutation = { deactivateFuelProduct: { id: string, name: string, unitPrice: string, status: FuelSetupStatus, revision: number } };

export type CreatePumpMeterMutationVariables = Exact<{
  input: CreatePumpMeterInput;
}>;


export type CreatePumpMeterMutation = { createPumpMeter: { id: string, label: string, productId: string, initialReading: string, currentReading: string, status: FuelSetupStatus, revision: number } };

export type UpdatePumpMeterMutationVariables = Exact<{
  input: UpdatePumpMeterInput;
}>;


export type UpdatePumpMeterMutation = { updatePumpMeter: { id: string, label: string, productId: string, initialReading: string, currentReading: string, status: FuelSetupStatus, revision: number } };

export type DeactivatePumpMeterMutationVariables = Exact<{
  input: DeactivateFuelSetupInput;
}>;


export type DeactivatePumpMeterMutation = { deactivatePumpMeter: { id: string, label: string, productId: string, initialReading: string, currentReading: string, status: FuelSetupStatus, revision: number } };

export type TenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type TenantsQuery = { tenants: Array<{ role: UserRole, tenant: { id: string, name: string, timezone: string, currency: string } }> };

export type CreateTenantMutationVariables = Exact<{
  input: CreateTenantInput;
}>;


export type CreateTenantMutation = { createTenant: { id: string, name: string, timezone: string, currency: string } };

export type UpdateTenantMutationVariables = Exact<{
  input: UpdateTenantInput;
}>;


export type UpdateTenantMutation = { updateTenant: { id: string, name: string, timezone: string, currency: string } };

export type DeleteTenantMutationVariables = Exact<{
  input: DeleteTenantInput;
}>;


export type DeleteTenantMutation = { deleteTenant: boolean };

export type ShiftsQueryVariables = Exact<{ [key: string]: never; }>;


export type ShiftsQuery = { shifts: Array<{ id: string, startTime: string, endTime: string }> };

export type CreateShiftMutationVariables = Exact<{
  input: CreateShiftInput;
}>;


export type CreateShiftMutation = { createShift: { id: string, startTime: string, endTime: string } };

export type UpdateShiftMutationVariables = Exact<{
  input: UpdateShiftInput;
}>;


export type UpdateShiftMutation = { updateShift: { id: string, startTime: string, endTime: string } };

export type DeleteShiftMutationVariables = Exact<{
  input: DeleteShiftInput;
}>;


export type DeleteShiftMutation = { deleteShift: boolean };

export type RecurringIncomeConfigurationQueryVariables = Exact<{ [key: string]: never; }>;


export type RecurringIncomeConfigurationQuery = { recurringIncomeConfiguration: { revision: number, fields: Array<{ id: string, description: string, active: boolean }> } };

export type UpdateRecurringIncomeConfigurationMutationVariables = Exact<{
  input: UpdateRecurringIncomeConfigurationInput;
}>;


export type UpdateRecurringIncomeConfigurationMutation = { updateRecurringIncomeConfiguration: { revision: number, fields: Array<{ id: string, description: string, active: boolean }> } };

export type UsersQueryVariables = Exact<{
  input: UsersInput;
}>;


export type UsersQuery = { users: { totalCount: number, items: Array<{ id: string, firstName: string | null, lastName: string | null, fullName: string, username: string, role: UserRole, status: UserStatus }> } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { createUser: { id: string, firstName: string | null, lastName: string | null, fullName: string, username: string, role: UserRole, status: UserStatus } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { updateUser: { id: string, firstName: string | null, lastName: string | null, fullName: string, username: string, role: UserRole, status: UserStatus } };

export type ResetUserPasswordMutationVariables = Exact<{
  input: ResetUserPasswordInput;
}>;


export type ResetUserPasswordMutation = { resetUserPassword: { id: string, username: string } };

export type DeleteUserMutationVariables = Exact<{
  input: DeleteUserInput;
}>;


export type DeleteUserMutation = { deleteUser: boolean };

export const AttendanceStatusFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttendanceStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AttendanceStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDate"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"asOf"}},{"kind":"Field","name":{"kind":"Name","value":"trackedSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"automaticSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"activeSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<AttendanceStatusFieldsFragment, unknown>;
export const TimesheetDayFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimesheetDayFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimesheetDay"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDate"}},{"kind":"Field","name":{"kind":"Name","value":"trackedSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"automaticSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"overrideHours"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveHours"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<TimesheetDayFieldsFragment, unknown>;
export const InventoryProductFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"stockCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<InventoryProductFieldsFragment, unknown>;
export const StockMovementFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockMovementFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"quantityChange"}},{"kind":"Field","name":{"kind":"Name","value":"balanceBefore"}},{"kind":"Field","name":{"kind":"Name","value":"balanceAfter"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"reportId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<StockMovementFieldsFragment, unknown>;
export const ReportFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}}]} as unknown as DocumentNode<ReportFieldsFragment, unknown>;
export const ReportDetailFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}},{"kind":"Field","name":{"kind":"Name","value":"effective"}},{"kind":"Field","name":{"kind":"Name","value":"revokedFromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"revokedById"}},{"kind":"Field","name":{"kind":"Name","value":"incomeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expenseEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"income"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"}},{"kind":"Field","name":{"kind":"Name","value":"cashFuelSales"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"overShort"}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"predecessorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"successorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"blockingIssues"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meterId"}},{"kind":"Field","name":{"kind":"Name","value":"meterLabel"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"openingReading"}},{"kind":"Field","name":{"kind":"Name","value":"openingSource"}},{"kind":"Field","name":{"kind":"Name","value":"closingReading"}},{"kind":"Field","name":{"kind":"Name","value":"calibration"}},{"kind":"Field","name":{"kind":"Name","value":"netVolume"}},{"kind":"Field","name":{"kind":"Name","value":"sales"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}}]} as unknown as DocumentNode<ReportDetailFieldsFragment, unknown>;
export const FuelProductFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FuelProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FuelProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<FuelProductFieldsFragment, unknown>;
export const PumpMeterFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PumpMeterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PumpMeter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"initialReading"}},{"kind":"Field","name":{"kind":"Name","value":"currentReading"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<PumpMeterFieldsFragment, unknown>;
export const UpdateMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMyProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const MyAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttendanceStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttendanceStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AttendanceStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDate"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"asOf"}},{"kind":"Field","name":{"kind":"Name","value":"trackedSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"automaticSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"activeSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<MyAttendanceQuery, MyAttendanceQueryVariables>;
export const CheckInAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckInAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CheckInAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkInAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttendanceStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttendanceStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AttendanceStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDate"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"asOf"}},{"kind":"Field","name":{"kind":"Name","value":"trackedSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"automaticSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"activeSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<CheckInAttendanceMutation, CheckInAttendanceMutationVariables>;
export const CheckOutAttendanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckOutAttendance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CheckOutAttendanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkOutAttendance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttendanceStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttendanceStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AttendanceStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDate"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"asOf"}},{"kind":"Field","name":{"kind":"Name","value":"trackedSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"automaticSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"activeSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<CheckOutAttendanceMutation, CheckOutAttendanceMutationVariables>;
export const TimesheetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Timesheets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimesheetsFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timesheets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"asOf"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"totalHours"}}]}}]}}]}}]} as unknown as DocumentNode<TimesheetsQuery, TimesheetsQueryVariables>;
export const TimesheetDaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TimesheetDays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimesheetDaysFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timesheetDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimesheetDayFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimesheetDayFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimesheetDay"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDate"}},{"kind":"Field","name":{"kind":"Name","value":"trackedSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"automaticSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"overrideHours"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveHours"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<TimesheetDaysQuery, TimesheetDaysQueryVariables>;
export const SetTimesheetDayOverrideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetTimesheetDayOverride"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTimesheetDayOverrideInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTimesheetDayOverride"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimesheetDayFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimesheetDayFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimesheetDay"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDate"}},{"kind":"Field","name":{"kind":"Name","value":"trackedSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"automaticSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"overrideHours"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveHours"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<SetTimesheetDayOverrideMutation, SetTimesheetDayOverrideMutationVariables>;
export const InventoryProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InventoryProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryProductsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inventoryProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"stockCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<InventoryProductsQuery, InventoryProductsQueryVariables>;
export const StockMovementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StockMovements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StockMovementsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockMovements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StockMovementFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockMovementFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"quantityChange"}},{"kind":"Field","name":{"kind":"Name","value":"balanceBefore"}},{"kind":"Field","name":{"kind":"Name","value":"balanceAfter"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"reportId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<StockMovementsQuery, StockMovementsQueryVariables>;
export const CreateInventoryProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInventoryProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInventoryProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInventoryProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"stockCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<CreateInventoryProductMutation, CreateInventoryProductMutationVariables>;
export const UpdateInventoryProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInventoryProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInventoryProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInventoryProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"stockCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<UpdateInventoryProductMutation, UpdateInventoryProductMutationVariables>;
export const DeactivateInventoryProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateInventoryProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateInventoryProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateInventoryProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InventoryProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InventoryProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"stockCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<DeactivateInventoryProductMutation, DeactivateInventoryProductMutationVariables>;
export const RecordStockMovementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecordStockMovement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecordStockMovementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordStockMovement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StockMovementFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockMovementFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"quantityChange"}},{"kind":"Field","name":{"kind":"Name","value":"balanceBefore"}},{"kind":"Field","name":{"kind":"Name","value":"balanceAfter"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"reportId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<RecordStockMovementMutation, RecordStockMovementMutationVariables>;
export const ReportCreationContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReportCreationContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reportCreationContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"blockedReason"}},{"kind":"Field","name":{"kind":"Name","value":"shift"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"report"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}}]} as unknown as DocumentNode<ReportCreationContextQuery, ReportCreationContextQueryVariables>;
export const ReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Reports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"effective"}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"income"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"}},{"kind":"Field","name":{"kind":"Name","value":"cashFuelSales"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"overShort"}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}}]} as unknown as DocumentNode<ReportsQuery, ReportsQueryVariables>;
export const ReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Report"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportDetailFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}},{"kind":"Field","name":{"kind":"Name","value":"effective"}},{"kind":"Field","name":{"kind":"Name","value":"revokedFromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"revokedById"}},{"kind":"Field","name":{"kind":"Name","value":"incomeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expenseEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"income"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"}},{"kind":"Field","name":{"kind":"Name","value":"cashFuelSales"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"overShort"}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"predecessorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"successorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"blockingIssues"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meterId"}},{"kind":"Field","name":{"kind":"Name","value":"meterLabel"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"openingReading"}},{"kind":"Field","name":{"kind":"Name","value":"openingSource"}},{"kind":"Field","name":{"kind":"Name","value":"closingReading"}},{"kind":"Field","name":{"kind":"Name","value":"calibration"}},{"kind":"Field","name":{"kind":"Name","value":"netVolume"}},{"kind":"Field","name":{"kind":"Name","value":"sales"}}]}}]}}]}}]} as unknown as DocumentNode<ReportQuery, ReportQueryVariables>;
export const CreateReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"report"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportDetailFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}},{"kind":"Field","name":{"kind":"Name","value":"effective"}},{"kind":"Field","name":{"kind":"Name","value":"revokedFromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"revokedById"}},{"kind":"Field","name":{"kind":"Name","value":"incomeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expenseEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"income"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"}},{"kind":"Field","name":{"kind":"Name","value":"cashFuelSales"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"overShort"}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"predecessorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"successorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"blockingIssues"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meterId"}},{"kind":"Field","name":{"kind":"Name","value":"meterLabel"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"openingReading"}},{"kind":"Field","name":{"kind":"Name","value":"openingSource"}},{"kind":"Field","name":{"kind":"Name","value":"closingReading"}},{"kind":"Field","name":{"kind":"Name","value":"calibration"}},{"kind":"Field","name":{"kind":"Name","value":"netVolume"}},{"kind":"Field","name":{"kind":"Name","value":"sales"}}]}}]}}]}}]} as unknown as DocumentNode<CreateReportMutation, CreateReportMutationVariables>;
export const SaveReportDraftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveReportDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveReportDraftInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveReportDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportDetailFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}},{"kind":"Field","name":{"kind":"Name","value":"effective"}},{"kind":"Field","name":{"kind":"Name","value":"revokedFromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"revokedById"}},{"kind":"Field","name":{"kind":"Name","value":"incomeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expenseEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"income"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"}},{"kind":"Field","name":{"kind":"Name","value":"cashFuelSales"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"overShort"}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"predecessorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"successorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"blockingIssues"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meterId"}},{"kind":"Field","name":{"kind":"Name","value":"meterLabel"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"openingReading"}},{"kind":"Field","name":{"kind":"Name","value":"openingSource"}},{"kind":"Field","name":{"kind":"Name","value":"closingReading"}},{"kind":"Field","name":{"kind":"Name","value":"calibration"}},{"kind":"Field","name":{"kind":"Name","value":"netVolume"}},{"kind":"Field","name":{"kind":"Name","value":"sales"}}]}}]}}]}}]} as unknown as DocumentNode<SaveReportDraftMutation, SaveReportDraftMutationVariables>;
export const SubmitReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportTransitionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportDetailFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}},{"kind":"Field","name":{"kind":"Name","value":"effective"}},{"kind":"Field","name":{"kind":"Name","value":"revokedFromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"revokedById"}},{"kind":"Field","name":{"kind":"Name","value":"incomeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expenseEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"income"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"}},{"kind":"Field","name":{"kind":"Name","value":"cashFuelSales"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"overShort"}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"predecessorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"successorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"blockingIssues"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meterId"}},{"kind":"Field","name":{"kind":"Name","value":"meterLabel"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"openingReading"}},{"kind":"Field","name":{"kind":"Name","value":"openingSource"}},{"kind":"Field","name":{"kind":"Name","value":"closingReading"}},{"kind":"Field","name":{"kind":"Name","value":"calibration"}},{"kind":"Field","name":{"kind":"Name","value":"netVolume"}},{"kind":"Field","name":{"kind":"Name","value":"sales"}}]}}]}}]}}]} as unknown as DocumentNode<SubmitReportMutation, SubmitReportMutationVariables>;
export const DeleteReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportDetailFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessDate"}},{"kind":"Field","name":{"kind":"Name","value":"shiftId"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedById"}},{"kind":"Field","name":{"kind":"Name","value":"submittedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedByName"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Report"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportFields"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}},{"kind":"Field","name":{"kind":"Name","value":"effective"}},{"kind":"Field","name":{"kind":"Name","value":"revokedFromStatus"}},{"kind":"Field","name":{"kind":"Name","value":"revokedById"}},{"kind":"Field","name":{"kind":"Name","value":"incomeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expenseEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeFieldId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"income"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"}},{"kind":"Field","name":{"kind":"Name","value":"cashFuelSales"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"overShort"}},{"kind":"Field","name":{"kind":"Name","value":"lubricantSales"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"predecessorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"successorBatchId"}},{"kind":"Field","name":{"kind":"Name","value":"pumpSales"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"blockingIssues"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meterId"}},{"kind":"Field","name":{"kind":"Name","value":"meterLabel"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"openingReading"}},{"kind":"Field","name":{"kind":"Name","value":"openingSource"}},{"kind":"Field","name":{"kind":"Name","value":"closingReading"}},{"kind":"Field","name":{"kind":"Name","value":"calibration"}},{"kind":"Field","name":{"kind":"Name","value":"netVolume"}},{"kind":"Field","name":{"kind":"Name","value":"sales"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteReportMutation, DeleteReportMutationVariables>;
export const FuelSetupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FuelSetup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fuelSetup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FuelProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PumpMeterFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FuelProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FuelProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PumpMeterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PumpMeter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"initialReading"}},{"kind":"Field","name":{"kind":"Name","value":"currentReading"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<FuelSetupQuery, FuelSetupQueryVariables>;
export const CreateFuelProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFuelProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFuelProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFuelProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FuelProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FuelProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FuelProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<CreateFuelProductMutation, CreateFuelProductMutationVariables>;
export const UpdateFuelProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFuelProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFuelProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFuelProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FuelProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FuelProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FuelProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<UpdateFuelProductMutation, UpdateFuelProductMutationVariables>;
export const DeactivateFuelProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateFuelProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateFuelSetupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateFuelProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FuelProductFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FuelProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FuelProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<DeactivateFuelProductMutation, DeactivateFuelProductMutationVariables>;
export const CreatePumpMeterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePumpMeter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePumpMeterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPumpMeter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PumpMeterFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PumpMeterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PumpMeter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"initialReading"}},{"kind":"Field","name":{"kind":"Name","value":"currentReading"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<CreatePumpMeterMutation, CreatePumpMeterMutationVariables>;
export const UpdatePumpMeterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePumpMeter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePumpMeterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePumpMeter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PumpMeterFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PumpMeterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PumpMeter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"initialReading"}},{"kind":"Field","name":{"kind":"Name","value":"currentReading"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<UpdatePumpMeterMutation, UpdatePumpMeterMutationVariables>;
export const DeactivatePumpMeterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivatePumpMeter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateFuelSetupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivatePumpMeter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PumpMeterFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PumpMeterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PumpMeter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"initialReading"}},{"kind":"Field","name":{"kind":"Name","value":"currentReading"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"revision"}}]}}]} as unknown as DocumentNode<DeactivatePumpMeterMutation, DeactivatePumpMeterMutationVariables>;
export const TenantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]}}]} as unknown as DocumentNode<TenantsQuery, TenantsQueryVariables>;
export const CreateTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTenantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]} as unknown as DocumentNode<CreateTenantMutation, CreateTenantMutationVariables>;
export const UpdateTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTenantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]} as unknown as DocumentNode<UpdateTenantMutation, UpdateTenantMutationVariables>;
export const DeleteTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTenantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteTenantMutation, DeleteTenantMutationVariables>;
export const ShiftsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Shifts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shifts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}}]} as unknown as DocumentNode<ShiftsQuery, ShiftsQueryVariables>;
export const CreateShiftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShift"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateShiftInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShift"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}}]} as unknown as DocumentNode<CreateShiftMutation, CreateShiftMutationVariables>;
export const UpdateShiftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateShift"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateShiftInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateShift"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}}]} as unknown as DocumentNode<UpdateShiftMutation, UpdateShiftMutationVariables>;
export const DeleteShiftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteShift"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteShiftInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteShift"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteShiftMutation, DeleteShiftMutationVariables>;
export const RecurringIncomeConfigurationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecurringIncomeConfiguration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringIncomeConfiguration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<RecurringIncomeConfigurationQuery, RecurringIncomeConfigurationQueryVariables>;
export const UpdateRecurringIncomeConfigurationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecurringIncomeConfiguration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRecurringIncomeConfigurationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRecurringIncomeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revision"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRecurringIncomeConfigurationMutation, UpdateRecurringIncomeConfigurationMutationVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UsersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const ResetUserPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetUserPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetUserPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetUserPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<ResetUserPasswordMutation, ResetUserPasswordMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;