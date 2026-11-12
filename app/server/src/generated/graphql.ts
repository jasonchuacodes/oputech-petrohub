import type { Types } from 'mongoose';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GraphqlContext } from '../common/graphql/graphql-context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Decimal: { input: string; output: string; }
  ObjectId: { input: Types.ObjectId; output: Types.ObjectId; }
};

export type AttendanceSessionStatus = {
  __typename?: 'AttendanceSessionStatus';
  id: Scalars['ObjectId']['output'];
  startedAt: Scalars['String']['output'];
};

export type AttendanceStatus = {
  __typename?: 'AttendanceStatus';
  activeSession?: Maybe<AttendanceSessionStatus>;
  asOf: Scalars['String']['output'];
  automaticSeconds: Scalars['Int']['output'];
  localDate: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  trackedSeconds: Scalars['Int']['output'];
};

export type ChangeFuelPriceInput = {
  effectiveDate: Scalars['String']['input'];
  effectiveHour: Scalars['Int']['input'];
  expectedRevision: Scalars['Int']['input'];
  productId: Scalars['ObjectId']['input'];
  unitPrice: Scalars['Decimal']['input'];
};

export type CheckInAttendanceInput = {
  idempotencyKey: Scalars['String']['input'];
};

export type CheckOutAttendanceInput = {
  sessionId: Scalars['ObjectId']['input'];
};

export type CreateFuelProductInput = {
  name: Scalars['String']['input'];
  unitPrice: Scalars['Decimal']['input'];
};

export type CreateInventoryProductInput = {
  idempotencyKey: Scalars['String']['input'];
  name: Scalars['String']['input'];
  openingStock: Scalars['Decimal']['input'];
  unit: Scalars['String']['input'];
  unitPrice: Scalars['Decimal']['input'];
};

export type CreatePumpMeterInput = {
  initialReading: Scalars['Decimal']['input'];
  label: Scalars['String']['input'];
  productId: Scalars['ObjectId']['input'];
};

export type CreateReportInput = {
  businessDate: Scalars['String']['input'];
  slotId: Scalars['String']['input'];
};

export type CreateReportPayload = {
  __typename?: 'CreateReportPayload';
  created: Scalars['Boolean']['output'];
  report: Report;
};

export type CreateShiftInput = {
  endTime: Scalars['String']['input'];
  name: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type CreateTenantInput = {
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  password: Scalars['String']['input'];
  role?: InputMaybe<UserRole>;
  username: Scalars['String']['input'];
};

export type DeactivateFuelSetupInput = {
  expectedRevision: Scalars['Int']['input'];
  id: Scalars['ObjectId']['input'];
};

export type DeactivateInventoryProductInput = {
  expectedRevision: Scalars['Int']['input'];
  productId: Scalars['ObjectId']['input'];
};

export type DeleteReportInput = {
  expectedDisposalRevision: Scalars['Int']['input'];
  expectedReportRevision: Scalars['Int']['input'];
  reason: Scalars['String']['input'];
  reportId: Scalars['ObjectId']['input'];
};

export type DeleteShiftInput = {
  shiftId: Scalars['ObjectId']['input'];
};

export type DeleteTenantInput = {
  tenantId: Scalars['ObjectId']['input'];
};

export type DeleteUserInput = {
  userId: Scalars['ObjectId']['input'];
};

export type DisposalBatch = {
  __typename?: 'DisposalBatch';
  blockingIssues: Array<Scalars['String']['output']>;
  complete: Scalars['Boolean']['output'];
  id: Scalars['ObjectId']['output'];
  predecessorBatchId?: Maybe<Scalars['ObjectId']['output']>;
  pumpSales?: Maybe<Scalars['Decimal']['output']>;
  readings: Array<DisposalReading>;
  revision: Scalars['Int']['output'];
  status: DisposalBatchStatus;
  successorBatchId?: Maybe<Scalars['ObjectId']['output']>;
};

export type DisposalBatchStatus =
  | 'draft'
  | 'revoked'
  | 'submitted';

export type DisposalOpeningSource =
  | 'baseline'
  | 'previous_report';

export type DisposalReading = {
  __typename?: 'DisposalReading';
  calibration: Scalars['Decimal']['output'];
  closingReading?: Maybe<Scalars['Decimal']['output']>;
  meterId: Scalars['ObjectId']['output'];
  meterLabel: Scalars['String']['output'];
  netVolume?: Maybe<Scalars['Decimal']['output']>;
  openingReading: Scalars['Decimal']['output'];
  openingSource: DisposalOpeningSource;
  productId: Scalars['ObjectId']['output'];
  productName: Scalars['String']['output'];
  sales?: Maybe<Scalars['Decimal']['output']>;
  unitPrice: Scalars['Decimal']['output'];
};

export type EditableDisposalInput = {
  calibration: Scalars['Decimal']['input'];
  closingReading?: InputMaybe<Scalars['Decimal']['input']>;
  meterId: Scalars['ObjectId']['input'];
};

export type FinancialAmounts = {
  __typename?: 'FinancialAmounts';
  expenses: Scalars['Decimal']['output'];
  income: Scalars['Decimal']['output'];
  lubricantSales: Scalars['Decimal']['output'];
};

export type FinancialBucket = {
  __typename?: 'FinancialBucket';
  amounts: FinancialAmounts;
  endDate: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
};

export type FinancialBucketInterval =
  | 'day'
  | 'month'
  | 'week';

export type FinancialEntry = {
  __typename?: 'FinancialEntry';
  amount: Scalars['Decimal']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  recurringIncomeFieldId?: Maybe<Scalars['ObjectId']['output']>;
};

export type FinancialEntryInput = {
  amount: Scalars['Decimal']['input'];
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type FinancialSummary = {
  __typename?: 'FinancialSummary';
  bucketInterval: FinancialBucketInterval;
  buckets: Array<FinancialBucket>;
  currency: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  includedReportCount: Scalars['Int']['output'];
  startDate: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  totals: FinancialAmounts;
};

export type FinancialSummaryInput = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type FuelPriceChange = {
  __typename?: 'FuelPriceChange';
  effectiveDate: Scalars['String']['output'];
  effectiveHour: Scalars['Int']['output'];
  unitPrice: Scalars['Decimal']['output'];
};

export type FuelProduct = {
  __typename?: 'FuelProduct';
  id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  nextPriceChange?: Maybe<FuelPriceChange>;
  revision: Scalars['Int']['output'];
  status: FuelSetupStatus;
  unitPrice: Scalars['Decimal']['output'];
};

export type FuelSetup = {
  __typename?: 'FuelSetup';
  meters: Array<PumpMeter>;
  products: Array<FuelProduct>;
};

export type FuelSetupStatus =
  | 'active'
  | 'inactive';

export type InventoryProduct = {
  __typename?: 'InventoryProduct';
  id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  status: InventoryProductStatus;
  stockCount: Scalars['Decimal']['output'];
  unit: Scalars['String']['output'];
  unitPrice: Scalars['Decimal']['output'];
};

export type InventoryProductPage = {
  __typename?: 'InventoryProductPage';
  items: Array<InventoryProduct>;
  totalCount: Scalars['Int']['output'];
};

export type InventoryProductStatus =
  | 'active'
  | 'inactive';

export type InventoryProductsInput = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type LubricantSale = {
  __typename?: 'LubricantSale';
  amount: Scalars['Decimal']['output'];
  id: Scalars['String']['output'];
  productId: Scalars['ObjectId']['output'];
  productName: Scalars['String']['output'];
  quantity: Scalars['Decimal']['output'];
  unit: Scalars['String']['output'];
  unitPrice: Scalars['Decimal']['output'];
};

export type LubricantSaleInput = {
  id: Scalars['String']['input'];
  productId: Scalars['ObjectId']['input'];
  quantity: Scalars['Decimal']['input'];
};

export type ManualStockMovementType =
  | 'stock_in'
  | 'stock_out';

export type Mutation = {
  __typename?: 'Mutation';
  changeFuelPrice: FuelProduct;
  checkInAttendance: AttendanceStatus;
  checkOutAttendance: AttendanceStatus;
  createFuelProduct: FuelProduct;
  createInventoryProduct: InventoryProduct;
  createPumpMeter: PumpMeter;
  createReport: CreateReportPayload;
  createShift: Shift;
  createTenant: TenantSummary;
  createUser: User;
  deactivateFuelProduct: FuelProduct;
  deactivateInventoryProduct: InventoryProduct;
  deactivatePumpMeter: PumpMeter;
  deleteReport: Report;
  deleteShift: Scalars['Boolean']['output'];
  deleteTenant: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  recordStockMovement: StockMovement;
  resetUserPassword: User;
  saveReportDraft: Report;
  setTimesheetDayOverride: TimesheetDay;
  submitReport: Report;
  updateFuelProduct: FuelProduct;
  updateInventoryProduct: InventoryProduct;
  updateMyProfile: User;
  updatePumpMeter: PumpMeter;
  updateRecurringIncomeConfiguration: RecurringIncomeConfiguration;
  updateReportRemarks: Report;
  updateShift: Shift;
  updateTenant: TenantSummary;
  updateUser: User;
};


export type MutationChangeFuelPriceArgs = {
  input: ChangeFuelPriceInput;
};


export type MutationCheckInAttendanceArgs = {
  input: CheckInAttendanceInput;
};


export type MutationCheckOutAttendanceArgs = {
  input: CheckOutAttendanceInput;
};


export type MutationCreateFuelProductArgs = {
  input: CreateFuelProductInput;
};


export type MutationCreateInventoryProductArgs = {
  input: CreateInventoryProductInput;
};


export type MutationCreatePumpMeterArgs = {
  input: CreatePumpMeterInput;
};


export type MutationCreateReportArgs = {
  input: CreateReportInput;
};


export type MutationCreateShiftArgs = {
  input: CreateShiftInput;
};


export type MutationCreateTenantArgs = {
  input: CreateTenantInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeactivateFuelProductArgs = {
  input: DeactivateFuelSetupInput;
};


export type MutationDeactivateInventoryProductArgs = {
  input: DeactivateInventoryProductInput;
};


export type MutationDeactivatePumpMeterArgs = {
  input: DeactivateFuelSetupInput;
};


export type MutationDeleteReportArgs = {
  input: DeleteReportInput;
};


export type MutationDeleteShiftArgs = {
  input: DeleteShiftInput;
};


export type MutationDeleteTenantArgs = {
  input: DeleteTenantInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationRecordStockMovementArgs = {
  input: RecordStockMovementInput;
};


export type MutationResetUserPasswordArgs = {
  input: ResetUserPasswordInput;
};


export type MutationSaveReportDraftArgs = {
  input: SaveReportDraftInput;
};


export type MutationSetTimesheetDayOverrideArgs = {
  input: SetTimesheetDayOverrideInput;
};


export type MutationSubmitReportArgs = {
  input: ReportTransitionInput;
};


export type MutationUpdateFuelProductArgs = {
  input: UpdateFuelProductInput;
};


export type MutationUpdateInventoryProductArgs = {
  input: UpdateInventoryProductInput;
};


export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileInput;
};


export type MutationUpdatePumpMeterArgs = {
  input: UpdatePumpMeterInput;
};


export type MutationUpdateRecurringIncomeConfigurationArgs = {
  input: UpdateRecurringIncomeConfigurationInput;
};


export type MutationUpdateReportRemarksArgs = {
  input: UpdateReportRemarksInput;
};


export type MutationUpdateShiftArgs = {
  input: UpdateShiftInput;
};


export type MutationUpdateTenantArgs = {
  input: UpdateTenantInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type PumpMeter = {
  __typename?: 'PumpMeter';
  currentReading: Scalars['Decimal']['output'];
  id: Scalars['ObjectId']['output'];
  initialReading: Scalars['Decimal']['output'];
  label: Scalars['String']['output'];
  productId: Scalars['ObjectId']['output'];
  revision: Scalars['Int']['output'];
  status: FuelSetupStatus;
};

export type Query = {
  __typename?: 'Query';
  activeTenant?: Maybe<TenantSummary>;
  financialSummary: FinancialSummary;
  fuelSetup: FuelSetup;
  inventoryProducts: InventoryProductPage;
  myAttendance: AttendanceStatus;
  recurringIncomeConfiguration: RecurringIncomeConfiguration;
  report: Report;
  reportCreationContext: ReportCreationContext;
  reports: ReportPage;
  shifts: Array<Shift>;
  stockMovements: StockMovementPage;
  tenants: Array<TenantAccess>;
  timesheetDays: UserTimesheet;
  timesheets: TimesheetPage;
  users: UserPage;
};


export type QueryFinancialSummaryArgs = {
  input: FinancialSummaryInput;
};


export type QueryInventoryProductsArgs = {
  input: InventoryProductsInput;
};


export type QueryReportArgs = {
  input: ReportInput;
};


export type QueryReportsArgs = {
  input: ReportsInput;
};


export type QueryStockMovementsArgs = {
  input: StockMovementsInput;
};


export type QueryTimesheetDaysArgs = {
  filter: TimesheetDaysFilter;
};


export type QueryTimesheetsArgs = {
  filter: TimesheetsFilter;
};


export type QueryUsersArgs = {
  input: UsersInput;
};

export type RecordStockMovementInput = {
  idempotencyKey: Scalars['String']['input'];
  productId: Scalars['ObjectId']['input'];
  quantity: Scalars['Decimal']['input'];
  reason: Scalars['String']['input'];
  type: ManualStockMovementType;
};

export type RecurringIncomeConfiguration = {
  __typename?: 'RecurringIncomeConfiguration';
  fields: Array<RecurringIncomeField>;
  revision: Scalars['Int']['output'];
};

export type RecurringIncomeField = {
  __typename?: 'RecurringIncomeField';
  active: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ObjectId']['output'];
};

export type RecurringIncomeFieldInput = {
  active: Scalars['Boolean']['input'];
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type Report = {
  __typename?: 'Report';
  businessDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  creatorId: Scalars['ObjectId']['output'];
  creatorName: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  disposals?: Maybe<DisposalBatch>;
  effective: Scalars['Boolean']['output'];
  expenseEntries: Array<FinancialEntry>;
  id: Scalars['ObjectId']['output'];
  incomeEntries: Array<FinancialEntry>;
  interval: ReportIntervalSnapshot;
  legacy: Scalars['Boolean']['output'];
  lubricantSales: Array<LubricantSale>;
  remarks: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  revocationReason?: Maybe<Scalars['String']['output']>;
  revokedAt?: Maybe<Scalars['String']['output']>;
  revokedById?: Maybe<Scalars['ObjectId']['output']>;
  revokedByName?: Maybe<Scalars['String']['output']>;
  revokedFromStatus?: Maybe<ReportStatus>;
  shiftId: Scalars['ObjectId']['output'];
  shiftName: Scalars['String']['output'];
  stale: Scalars['Boolean']['output'];
  status: ReportStatus;
  submittedAt?: Maybe<Scalars['String']['output']>;
  submittedById?: Maybe<Scalars['ObjectId']['output']>;
  submittedByName?: Maybe<Scalars['String']['output']>;
  totals: ReportTotals;
  updatedAt: Scalars['String']['output'];
};

export type ReportCreationContext = {
  __typename?: 'ReportCreationContext';
  businessDate: Scalars['String']['output'];
  slots: Array<ReportSlot>;
};

export type ReportInput = {
  reportId: Scalars['ObjectId']['input'];
};

export type ReportIntervalSnapshot = {
  __typename?: 'ReportIntervalSnapshot';
  endAt: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  startAt: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
};

export type ReportPage = {
  __typename?: 'ReportPage';
  items: Array<Report>;
  totalCount: Scalars['Int']['output'];
};

export type ReportSlot = {
  __typename?: 'ReportSlot';
  blockedReason?: Maybe<Scalars['String']['output']>;
  canCreate: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  interval: ReportIntervalSnapshot;
  report?: Maybe<Report>;
  shift: Shift;
};

export type ReportStatus =
  | 'draft'
  | 'revoked'
  | 'submitted';

export type ReportTotals = {
  __typename?: 'ReportTotals';
  cashFuelSales: Scalars['Decimal']['output'];
  expenses: Scalars['Decimal']['output'];
  income: Scalars['Decimal']['output'];
  lubricantSales: Scalars['Decimal']['output'];
  overShort?: Maybe<Scalars['Decimal']['output']>;
  pumpSales?: Maybe<Scalars['Decimal']['output']>;
};

export type ReportTransitionInput = {
  expectedDisposalRevision: Scalars['Int']['input'];
  expectedReportRevision: Scalars['Int']['input'];
  reportId: Scalars['ObjectId']['input'];
};

export type ReportsInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  submittedOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ResetUserPasswordInput = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['ObjectId']['input'];
};

export type SaveReportDraftInput = {
  disposalReadings: Array<EditableDisposalInput>;
  expectedDisposalRevision: Scalars['Int']['input'];
  expectedReportRevision: Scalars['Int']['input'];
  expenseEntries: Array<FinancialEntryInput>;
  incomeEntries: Array<FinancialEntryInput>;
  lubricantSales?: InputMaybe<Array<LubricantSaleInput>>;
  reportId: Scalars['ObjectId']['input'];
};

export type SetTimesheetDayOverrideInput = {
  expectedRevision: Scalars['Int']['input'];
  localDate: Scalars['String']['input'];
  overrideHours?: InputMaybe<Scalars['Decimal']['input']>;
  userId: Scalars['ObjectId']['input'];
};

export type Shift = {
  __typename?: 'Shift';
  endTime: Scalars['String']['output'];
  id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type StockMovement = {
  __typename?: 'StockMovement';
  actorName: Scalars['String']['output'];
  balanceAfter: Scalars['Decimal']['output'];
  balanceBefore: Scalars['Decimal']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ObjectId']['output'];
  productId: Scalars['ObjectId']['output'];
  productName: Scalars['String']['output'];
  quantityChange: Scalars['Decimal']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  reportId?: Maybe<Scalars['ObjectId']['output']>;
  type: StockMovementType;
  unit: Scalars['String']['output'];
};

export type StockMovementPage = {
  __typename?: 'StockMovementPage';
  items: Array<StockMovement>;
  pageInfo: StockMovementPageInfo;
};

export type StockMovementPageInfo = {
  __typename?: 'StockMovementPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type StockMovementType =
  | 'opening'
  | 'report_reversal'
  | 'report_sale'
  | 'stock_in'
  | 'stock_out';

export type StockMovementsInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ObjectId']['input'];
};

export type TenantAccess = {
  __typename?: 'TenantAccess';
  role: UserRole;
  tenant: TenantSummary;
};

export type TenantSummary = {
  __typename?: 'TenantSummary';
  currency: Scalars['String']['output'];
  id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
};

export type TimesheetDay = {
  __typename?: 'TimesheetDay';
  automaticSeconds: Scalars['Int']['output'];
  checkInAt?: Maybe<Scalars['String']['output']>;
  checkOutAt?: Maybe<Scalars['String']['output']>;
  effectiveHours: Scalars['Decimal']['output'];
  localDate: Scalars['String']['output'];
  overrideHours?: Maybe<Scalars['Decimal']['output']>;
  revision: Scalars['Int']['output'];
  trackedSeconds: Scalars['Int']['output'];
};

export type TimesheetDaysFilter = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  userId: Scalars['ObjectId']['input'];
};

export type TimesheetPage = {
  __typename?: 'TimesheetPage';
  asOf: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  items: Array<TimesheetUserSummary>;
  startDate: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  totalCount: Scalars['Int']['output'];
};

export type TimesheetUserSummary = {
  __typename?: 'TimesheetUserSummary';
  fullName: Scalars['String']['output'];
  totalHours: Scalars['Decimal']['output'];
  userId: Scalars['ObjectId']['output'];
  username: Scalars['String']['output'];
};

export type TimesheetsFilter = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type UpdateFuelProductInput = {
  expectedRevision: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  productId: Scalars['ObjectId']['input'];
};

export type UpdateInventoryProductInput = {
  expectedRevision: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  productId: Scalars['ObjectId']['input'];
  unit: Scalars['String']['input'];
  unitPrice: Scalars['Decimal']['input'];
};

export type UpdateMyProfileInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePumpMeterInput = {
  expectedRevision: Scalars['Int']['input'];
  label: Scalars['String']['input'];
  meterId: Scalars['ObjectId']['input'];
};

export type UpdateRecurringIncomeConfigurationInput = {
  expectedRevision: Scalars['Int']['input'];
  fields: Array<RecurringIncomeFieldInput>;
};

export type UpdateReportRemarksInput = {
  expectedRevision: Scalars['Int']['input'];
  remarks: Scalars['String']['input'];
  reportId: Scalars['ObjectId']['input'];
};

export type UpdateShiftInput = {
  endTime: Scalars['String']['input'];
  name: Scalars['String']['input'];
  shiftId: Scalars['ObjectId']['input'];
  startTime: Scalars['String']['input'];
};

export type UpdateTenantInput = {
  name: Scalars['String']['input'];
  tenantId: Scalars['ObjectId']['input'];
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  userId: Scalars['ObjectId']['input'];
  username: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  firstName?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  id: Scalars['ObjectId']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  status: UserStatus;
  username: Scalars['String']['output'];
};

export type UserPage = {
  __typename?: 'UserPage';
  items: Array<User>;
  totalCount: Scalars['Int']['output'];
};

export type UserRole =
  | 'admin'
  | 'member'
  | 'superadmin';

export type UserStatus =
  | 'active'
  | 'disabled';

export type UserTimesheet = {
  __typename?: 'UserTimesheet';
  days: Array<TimesheetDay>;
  fullName: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  userId: Scalars['ObjectId']['output'];
  username: Scalars['String']['output'];
};

export type UsersInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AttendanceSessionStatus: ResolverTypeWrapper<AttendanceSessionStatus>;
  AttendanceStatus: ResolverTypeWrapper<AttendanceStatus>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChangeFuelPriceInput: ChangeFuelPriceInput;
  CheckInAttendanceInput: CheckInAttendanceInput;
  CheckOutAttendanceInput: CheckOutAttendanceInput;
  CreateFuelProductInput: CreateFuelProductInput;
  CreateInventoryProductInput: CreateInventoryProductInput;
  CreatePumpMeterInput: CreatePumpMeterInput;
  CreateReportInput: CreateReportInput;
  CreateReportPayload: ResolverTypeWrapper<CreateReportPayload>;
  CreateShiftInput: CreateShiftInput;
  CreateTenantInput: CreateTenantInput;
  CreateUserInput: CreateUserInput;
  DeactivateFuelSetupInput: DeactivateFuelSetupInput;
  DeactivateInventoryProductInput: DeactivateInventoryProductInput;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']['output']>;
  DeleteReportInput: DeleteReportInput;
  DeleteShiftInput: DeleteShiftInput;
  DeleteTenantInput: DeleteTenantInput;
  DeleteUserInput: DeleteUserInput;
  DisposalBatch: ResolverTypeWrapper<DisposalBatch>;
  DisposalBatchStatus: DisposalBatchStatus;
  DisposalOpeningSource: DisposalOpeningSource;
  DisposalReading: ResolverTypeWrapper<DisposalReading>;
  EditableDisposalInput: EditableDisposalInput;
  FinancialAmounts: ResolverTypeWrapper<FinancialAmounts>;
  FinancialBucket: ResolverTypeWrapper<FinancialBucket>;
  FinancialBucketInterval: FinancialBucketInterval;
  FinancialEntry: ResolverTypeWrapper<FinancialEntry>;
  FinancialEntryInput: FinancialEntryInput;
  FinancialSummary: ResolverTypeWrapper<FinancialSummary>;
  FinancialSummaryInput: FinancialSummaryInput;
  FuelPriceChange: ResolverTypeWrapper<FuelPriceChange>;
  FuelProduct: ResolverTypeWrapper<FuelProduct>;
  FuelSetup: ResolverTypeWrapper<FuelSetup>;
  FuelSetupStatus: FuelSetupStatus;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InventoryProduct: ResolverTypeWrapper<InventoryProduct>;
  InventoryProductPage: ResolverTypeWrapper<InventoryProductPage>;
  InventoryProductStatus: InventoryProductStatus;
  InventoryProductsInput: InventoryProductsInput;
  LubricantSale: ResolverTypeWrapper<LubricantSale>;
  LubricantSaleInput: LubricantSaleInput;
  ManualStockMovementType: ManualStockMovementType;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  PumpMeter: ResolverTypeWrapper<PumpMeter>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RecordStockMovementInput: RecordStockMovementInput;
  RecurringIncomeConfiguration: ResolverTypeWrapper<RecurringIncomeConfiguration>;
  RecurringIncomeField: ResolverTypeWrapper<RecurringIncomeField>;
  RecurringIncomeFieldInput: RecurringIncomeFieldInput;
  Report: ResolverTypeWrapper<Report>;
  ReportCreationContext: ResolverTypeWrapper<ReportCreationContext>;
  ReportInput: ReportInput;
  ReportIntervalSnapshot: ResolverTypeWrapper<ReportIntervalSnapshot>;
  ReportPage: ResolverTypeWrapper<ReportPage>;
  ReportSlot: ResolverTypeWrapper<ReportSlot>;
  ReportStatus: ReportStatus;
  ReportTotals: ResolverTypeWrapper<ReportTotals>;
  ReportTransitionInput: ReportTransitionInput;
  ReportsInput: ReportsInput;
  ResetUserPasswordInput: ResetUserPasswordInput;
  SaveReportDraftInput: SaveReportDraftInput;
  SetTimesheetDayOverrideInput: SetTimesheetDayOverrideInput;
  Shift: ResolverTypeWrapper<Shift>;
  StockMovement: ResolverTypeWrapper<StockMovement>;
  StockMovementPage: ResolverTypeWrapper<StockMovementPage>;
  StockMovementPageInfo: ResolverTypeWrapper<StockMovementPageInfo>;
  StockMovementType: StockMovementType;
  StockMovementsInput: StockMovementsInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TenantAccess: ResolverTypeWrapper<TenantAccess>;
  TenantSummary: ResolverTypeWrapper<TenantSummary>;
  TimesheetDay: ResolverTypeWrapper<TimesheetDay>;
  TimesheetDaysFilter: TimesheetDaysFilter;
  TimesheetPage: ResolverTypeWrapper<TimesheetPage>;
  TimesheetUserSummary: ResolverTypeWrapper<TimesheetUserSummary>;
  TimesheetsFilter: TimesheetsFilter;
  UpdateFuelProductInput: UpdateFuelProductInput;
  UpdateInventoryProductInput: UpdateInventoryProductInput;
  UpdateMyProfileInput: UpdateMyProfileInput;
  UpdatePumpMeterInput: UpdatePumpMeterInput;
  UpdateRecurringIncomeConfigurationInput: UpdateRecurringIncomeConfigurationInput;
  UpdateReportRemarksInput: UpdateReportRemarksInput;
  UpdateShiftInput: UpdateShiftInput;
  UpdateTenantInput: UpdateTenantInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserPage: ResolverTypeWrapper<UserPage>;
  UserRole: UserRole;
  UserStatus: UserStatus;
  UserTimesheet: ResolverTypeWrapper<UserTimesheet>;
  UsersInput: UsersInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AttendanceSessionStatus: AttendanceSessionStatus;
  AttendanceStatus: AttendanceStatus;
  Boolean: Scalars['Boolean']['output'];
  ChangeFuelPriceInput: ChangeFuelPriceInput;
  CheckInAttendanceInput: CheckInAttendanceInput;
  CheckOutAttendanceInput: CheckOutAttendanceInput;
  CreateFuelProductInput: CreateFuelProductInput;
  CreateInventoryProductInput: CreateInventoryProductInput;
  CreatePumpMeterInput: CreatePumpMeterInput;
  CreateReportInput: CreateReportInput;
  CreateReportPayload: CreateReportPayload;
  CreateShiftInput: CreateShiftInput;
  CreateTenantInput: CreateTenantInput;
  CreateUserInput: CreateUserInput;
  DeactivateFuelSetupInput: DeactivateFuelSetupInput;
  DeactivateInventoryProductInput: DeactivateInventoryProductInput;
  Decimal: Scalars['Decimal']['output'];
  DeleteReportInput: DeleteReportInput;
  DeleteShiftInput: DeleteShiftInput;
  DeleteTenantInput: DeleteTenantInput;
  DeleteUserInput: DeleteUserInput;
  DisposalBatch: DisposalBatch;
  DisposalReading: DisposalReading;
  EditableDisposalInput: EditableDisposalInput;
  FinancialAmounts: FinancialAmounts;
  FinancialBucket: FinancialBucket;
  FinancialEntry: FinancialEntry;
  FinancialEntryInput: FinancialEntryInput;
  FinancialSummary: FinancialSummary;
  FinancialSummaryInput: FinancialSummaryInput;
  FuelPriceChange: FuelPriceChange;
  FuelProduct: FuelProduct;
  FuelSetup: FuelSetup;
  Int: Scalars['Int']['output'];
  InventoryProduct: InventoryProduct;
  InventoryProductPage: InventoryProductPage;
  InventoryProductsInput: InventoryProductsInput;
  LubricantSale: LubricantSale;
  LubricantSaleInput: LubricantSaleInput;
  Mutation: Record<PropertyKey, never>;
  ObjectId: Scalars['ObjectId']['output'];
  PumpMeter: PumpMeter;
  Query: Record<PropertyKey, never>;
  RecordStockMovementInput: RecordStockMovementInput;
  RecurringIncomeConfiguration: RecurringIncomeConfiguration;
  RecurringIncomeField: RecurringIncomeField;
  RecurringIncomeFieldInput: RecurringIncomeFieldInput;
  Report: Report;
  ReportCreationContext: ReportCreationContext;
  ReportInput: ReportInput;
  ReportIntervalSnapshot: ReportIntervalSnapshot;
  ReportPage: ReportPage;
  ReportSlot: ReportSlot;
  ReportTotals: ReportTotals;
  ReportTransitionInput: ReportTransitionInput;
  ReportsInput: ReportsInput;
  ResetUserPasswordInput: ResetUserPasswordInput;
  SaveReportDraftInput: SaveReportDraftInput;
  SetTimesheetDayOverrideInput: SetTimesheetDayOverrideInput;
  Shift: Shift;
  StockMovement: StockMovement;
  StockMovementPage: StockMovementPage;
  StockMovementPageInfo: StockMovementPageInfo;
  StockMovementsInput: StockMovementsInput;
  String: Scalars['String']['output'];
  TenantAccess: TenantAccess;
  TenantSummary: TenantSummary;
  TimesheetDay: TimesheetDay;
  TimesheetDaysFilter: TimesheetDaysFilter;
  TimesheetPage: TimesheetPage;
  TimesheetUserSummary: TimesheetUserSummary;
  TimesheetsFilter: TimesheetsFilter;
  UpdateFuelProductInput: UpdateFuelProductInput;
  UpdateInventoryProductInput: UpdateInventoryProductInput;
  UpdateMyProfileInput: UpdateMyProfileInput;
  UpdatePumpMeterInput: UpdatePumpMeterInput;
  UpdateRecurringIncomeConfigurationInput: UpdateRecurringIncomeConfigurationInput;
  UpdateReportRemarksInput: UpdateReportRemarksInput;
  UpdateShiftInput: UpdateShiftInput;
  UpdateTenantInput: UpdateTenantInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserPage: UserPage;
  UserTimesheet: UserTimesheet;
  UsersInput: UsersInput;
};

export type AttendanceSessionStatusResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['AttendanceSessionStatus'] = ResolversParentTypes['AttendanceSessionStatus']> = {
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AttendanceStatusResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['AttendanceStatus'] = ResolversParentTypes['AttendanceStatus']> = {
  activeSession?: Resolver<Maybe<ResolversTypes['AttendanceSessionStatus']>, ParentType, ContextType>;
  asOf?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  automaticSeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  localDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trackedSeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type CreateReportPayloadResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['CreateReportPayload'] = ResolversParentTypes['CreateReportPayload']> = {
  created?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  report?: Resolver<ResolversTypes['Report'], ParentType, ContextType>;
};

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export type DisposalBatchResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['DisposalBatch'] = ResolversParentTypes['DisposalBatch']> = {
  blockingIssues?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  predecessorBatchId?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  pumpSales?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  readings?: Resolver<Array<ResolversTypes['DisposalReading']>, ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DisposalBatchStatus'], ParentType, ContextType>;
  successorBatchId?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
};

export type DisposalReadingResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['DisposalReading'] = ResolversParentTypes['DisposalReading']> = {
  calibration?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  closingReading?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  meterId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  meterLabel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  netVolume?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  openingReading?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  openingSource?: Resolver<ResolversTypes['DisposalOpeningSource'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sales?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
};

export type FinancialAmountsResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FinancialAmounts'] = ResolversParentTypes['FinancialAmounts']> = {
  expenses?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  income?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  lubricantSales?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
};

export type FinancialBucketResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FinancialBucket'] = ResolversParentTypes['FinancialBucket']> = {
  amounts?: Resolver<ResolversTypes['FinancialAmounts'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type FinancialEntryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FinancialEntry'] = ResolversParentTypes['FinancialEntry']> = {
  amount?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recurringIncomeFieldId?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
};

export type FinancialSummaryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FinancialSummary'] = ResolversParentTypes['FinancialSummary']> = {
  bucketInterval?: Resolver<ResolversTypes['FinancialBucketInterval'], ParentType, ContextType>;
  buckets?: Resolver<Array<ResolversTypes['FinancialBucket']>, ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  includedReportCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totals?: Resolver<ResolversTypes['FinancialAmounts'], ParentType, ContextType>;
};

export type FuelPriceChangeResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FuelPriceChange'] = ResolversParentTypes['FuelPriceChange']> = {
  effectiveDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  effectiveHour?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
};

export type FuelProductResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FuelProduct'] = ResolversParentTypes['FuelProduct']> = {
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextPriceChange?: Resolver<Maybe<ResolversTypes['FuelPriceChange']>, ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['FuelSetupStatus'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
};

export type FuelSetupResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FuelSetup'] = ResolversParentTypes['FuelSetup']> = {
  meters?: Resolver<Array<ResolversTypes['PumpMeter']>, ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['FuelProduct']>, ParentType, ContextType>;
};

export type InventoryProductResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['InventoryProduct'] = ResolversParentTypes['InventoryProduct']> = {
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['InventoryProductStatus'], ParentType, ContextType>;
  stockCount?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
};

export type InventoryProductPageResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['InventoryProductPage'] = ResolversParentTypes['InventoryProductPage']> = {
  items?: Resolver<Array<ResolversTypes['InventoryProduct']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type LubricantSaleResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['LubricantSale'] = ResolversParentTypes['LubricantSale']> = {
  amount?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changeFuelPrice?: Resolver<ResolversTypes['FuelProduct'], ParentType, ContextType, RequireFields<MutationChangeFuelPriceArgs, 'input'>>;
  checkInAttendance?: Resolver<ResolversTypes['AttendanceStatus'], ParentType, ContextType, RequireFields<MutationCheckInAttendanceArgs, 'input'>>;
  checkOutAttendance?: Resolver<ResolversTypes['AttendanceStatus'], ParentType, ContextType, RequireFields<MutationCheckOutAttendanceArgs, 'input'>>;
  createFuelProduct?: Resolver<ResolversTypes['FuelProduct'], ParentType, ContextType, RequireFields<MutationCreateFuelProductArgs, 'input'>>;
  createInventoryProduct?: Resolver<ResolversTypes['InventoryProduct'], ParentType, ContextType, RequireFields<MutationCreateInventoryProductArgs, 'input'>>;
  createPumpMeter?: Resolver<ResolversTypes['PumpMeter'], ParentType, ContextType, RequireFields<MutationCreatePumpMeterArgs, 'input'>>;
  createReport?: Resolver<ResolversTypes['CreateReportPayload'], ParentType, ContextType, RequireFields<MutationCreateReportArgs, 'input'>>;
  createShift?: Resolver<ResolversTypes['Shift'], ParentType, ContextType, RequireFields<MutationCreateShiftArgs, 'input'>>;
  createTenant?: Resolver<ResolversTypes['TenantSummary'], ParentType, ContextType, RequireFields<MutationCreateTenantArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deactivateFuelProduct?: Resolver<ResolversTypes['FuelProduct'], ParentType, ContextType, RequireFields<MutationDeactivateFuelProductArgs, 'input'>>;
  deactivateInventoryProduct?: Resolver<ResolversTypes['InventoryProduct'], ParentType, ContextType, RequireFields<MutationDeactivateInventoryProductArgs, 'input'>>;
  deactivatePumpMeter?: Resolver<ResolversTypes['PumpMeter'], ParentType, ContextType, RequireFields<MutationDeactivatePumpMeterArgs, 'input'>>;
  deleteReport?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationDeleteReportArgs, 'input'>>;
  deleteShift?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteShiftArgs, 'input'>>;
  deleteTenant?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenantArgs, 'input'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'input'>>;
  recordStockMovement?: Resolver<ResolversTypes['StockMovement'], ParentType, ContextType, RequireFields<MutationRecordStockMovementArgs, 'input'>>;
  resetUserPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetUserPasswordArgs, 'input'>>;
  saveReportDraft?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationSaveReportDraftArgs, 'input'>>;
  setTimesheetDayOverride?: Resolver<ResolversTypes['TimesheetDay'], ParentType, ContextType, RequireFields<MutationSetTimesheetDayOverrideArgs, 'input'>>;
  submitReport?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationSubmitReportArgs, 'input'>>;
  updateFuelProduct?: Resolver<ResolversTypes['FuelProduct'], ParentType, ContextType, RequireFields<MutationUpdateFuelProductArgs, 'input'>>;
  updateInventoryProduct?: Resolver<ResolversTypes['InventoryProduct'], ParentType, ContextType, RequireFields<MutationUpdateInventoryProductArgs, 'input'>>;
  updateMyProfile?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateMyProfileArgs, 'input'>>;
  updatePumpMeter?: Resolver<ResolversTypes['PumpMeter'], ParentType, ContextType, RequireFields<MutationUpdatePumpMeterArgs, 'input'>>;
  updateRecurringIncomeConfiguration?: Resolver<ResolversTypes['RecurringIncomeConfiguration'], ParentType, ContextType, RequireFields<MutationUpdateRecurringIncomeConfigurationArgs, 'input'>>;
  updateReportRemarks?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationUpdateReportRemarksArgs, 'input'>>;
  updateShift?: Resolver<ResolversTypes['Shift'], ParentType, ContextType, RequireFields<MutationUpdateShiftArgs, 'input'>>;
  updateTenant?: Resolver<ResolversTypes['TenantSummary'], ParentType, ContextType, RequireFields<MutationUpdateTenantArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type PumpMeterResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['PumpMeter'] = ResolversParentTypes['PumpMeter']> = {
  currentReading?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  initialReading?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['FuelSetupStatus'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeTenant?: Resolver<Maybe<ResolversTypes['TenantSummary']>, ParentType, ContextType>;
  financialSummary?: Resolver<ResolversTypes['FinancialSummary'], ParentType, ContextType, RequireFields<QueryFinancialSummaryArgs, 'input'>>;
  fuelSetup?: Resolver<ResolversTypes['FuelSetup'], ParentType, ContextType>;
  inventoryProducts?: Resolver<ResolversTypes['InventoryProductPage'], ParentType, ContextType, RequireFields<QueryInventoryProductsArgs, 'input'>>;
  myAttendance?: Resolver<ResolversTypes['AttendanceStatus'], ParentType, ContextType>;
  recurringIncomeConfiguration?: Resolver<ResolversTypes['RecurringIncomeConfiguration'], ParentType, ContextType>;
  report?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<QueryReportArgs, 'input'>>;
  reportCreationContext?: Resolver<ResolversTypes['ReportCreationContext'], ParentType, ContextType>;
  reports?: Resolver<ResolversTypes['ReportPage'], ParentType, ContextType, RequireFields<QueryReportsArgs, 'input'>>;
  shifts?: Resolver<Array<ResolversTypes['Shift']>, ParentType, ContextType>;
  stockMovements?: Resolver<ResolversTypes['StockMovementPage'], ParentType, ContextType, RequireFields<QueryStockMovementsArgs, 'input'>>;
  tenants?: Resolver<Array<ResolversTypes['TenantAccess']>, ParentType, ContextType>;
  timesheetDays?: Resolver<ResolversTypes['UserTimesheet'], ParentType, ContextType, RequireFields<QueryTimesheetDaysArgs, 'filter'>>;
  timesheets?: Resolver<ResolversTypes['TimesheetPage'], ParentType, ContextType, RequireFields<QueryTimesheetsArgs, 'filter'>>;
  users?: Resolver<ResolversTypes['UserPage'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'input'>>;
};

export type RecurringIncomeConfigurationResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['RecurringIncomeConfiguration'] = ResolversParentTypes['RecurringIncomeConfiguration']> = {
  fields?: Resolver<Array<ResolversTypes['RecurringIncomeField']>, ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type RecurringIncomeFieldResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['RecurringIncomeField'] = ResolversParentTypes['RecurringIncomeField']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
};

export type ReportResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Report'] = ResolversParentTypes['Report']> = {
  businessDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  creatorName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  disposals?: Resolver<Maybe<ResolversTypes['DisposalBatch']>, ParentType, ContextType>;
  effective?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  expenseEntries?: Resolver<Array<ResolversTypes['FinancialEntry']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  incomeEntries?: Resolver<Array<ResolversTypes['FinancialEntry']>, ParentType, ContextType>;
  interval?: Resolver<ResolversTypes['ReportIntervalSnapshot'], ParentType, ContextType>;
  legacy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lubricantSales?: Resolver<Array<ResolversTypes['LubricantSale']>, ParentType, ContextType>;
  remarks?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revocationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revokedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revokedById?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  revokedByName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revokedFromStatus?: Resolver<Maybe<ResolversTypes['ReportStatus']>, ParentType, ContextType>;
  shiftId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  shiftName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stale?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReportStatus'], ParentType, ContextType>;
  submittedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  submittedById?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  submittedByName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totals?: Resolver<ResolversTypes['ReportTotals'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ReportCreationContextResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['ReportCreationContext'] = ResolversParentTypes['ReportCreationContext']> = {
  businessDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slots?: Resolver<Array<ResolversTypes['ReportSlot']>, ParentType, ContextType>;
};

export type ReportIntervalSnapshotResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['ReportIntervalSnapshot'] = ResolversParentTypes['ReportIntervalSnapshot']> = {
  endAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ReportPageResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['ReportPage'] = ResolversParentTypes['ReportPage']> = {
  items?: Resolver<Array<ResolversTypes['Report']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ReportSlotResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['ReportSlot'] = ResolversParentTypes['ReportSlot']> = {
  blockedReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  canCreate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interval?: Resolver<ResolversTypes['ReportIntervalSnapshot'], ParentType, ContextType>;
  report?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType>;
  shift?: Resolver<ResolversTypes['Shift'], ParentType, ContextType>;
};

export type ReportTotalsResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['ReportTotals'] = ResolversParentTypes['ReportTotals']> = {
  cashFuelSales?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  expenses?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  income?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  lubricantSales?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  overShort?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  pumpSales?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
};

export type ShiftResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Shift'] = ResolversParentTypes['Shift']> = {
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type StockMovementResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['StockMovement'] = ResolversParentTypes['StockMovement']> = {
  actorName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balanceAfter?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  balanceBefore?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantityChange?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reportId?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type StockMovementPageResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['StockMovementPage'] = ResolversParentTypes['StockMovementPage']> = {
  items?: Resolver<Array<ResolversTypes['StockMovement']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['StockMovementPageInfo'], ParentType, ContextType>;
};

export type StockMovementPageInfoResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['StockMovementPageInfo'] = ResolversParentTypes['StockMovementPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type TenantAccessResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['TenantAccess'] = ResolversParentTypes['TenantAccess']> = {
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  tenant?: Resolver<ResolversTypes['TenantSummary'], ParentType, ContextType>;
};

export type TenantSummaryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['TenantSummary'] = ResolversParentTypes['TenantSummary']> = {
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TimesheetDayResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['TimesheetDay'] = ResolversParentTypes['TimesheetDay']> = {
  automaticSeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  checkInAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  checkOutAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  effectiveHours?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  localDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  overrideHours?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trackedSeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TimesheetPageResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['TimesheetPage'] = ResolversParentTypes['TimesheetPage']> = {
  asOf?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['TimesheetUserSummary']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TimesheetUserSummaryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['TimesheetUserSummary'] = ResolversParentTypes['TimesheetUserSummary']> = {
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalHours?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserPageResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['UserPage'] = ResolversParentTypes['UserPage']> = {
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type UserTimesheetResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['UserTimesheet'] = ResolversParentTypes['UserTimesheet']> = {
  days?: Resolver<Array<ResolversTypes['TimesheetDay']>, ParentType, ContextType>;
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphqlContext> = {
  AttendanceSessionStatus?: AttendanceSessionStatusResolvers<ContextType>;
  AttendanceStatus?: AttendanceStatusResolvers<ContextType>;
  CreateReportPayload?: CreateReportPayloadResolvers<ContextType>;
  Decimal?: GraphQLScalarType;
  DisposalBatch?: DisposalBatchResolvers<ContextType>;
  DisposalReading?: DisposalReadingResolvers<ContextType>;
  FinancialAmounts?: FinancialAmountsResolvers<ContextType>;
  FinancialBucket?: FinancialBucketResolvers<ContextType>;
  FinancialEntry?: FinancialEntryResolvers<ContextType>;
  FinancialSummary?: FinancialSummaryResolvers<ContextType>;
  FuelPriceChange?: FuelPriceChangeResolvers<ContextType>;
  FuelProduct?: FuelProductResolvers<ContextType>;
  FuelSetup?: FuelSetupResolvers<ContextType>;
  InventoryProduct?: InventoryProductResolvers<ContextType>;
  InventoryProductPage?: InventoryProductPageResolvers<ContextType>;
  LubricantSale?: LubricantSaleResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ObjectId?: GraphQLScalarType;
  PumpMeter?: PumpMeterResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RecurringIncomeConfiguration?: RecurringIncomeConfigurationResolvers<ContextType>;
  RecurringIncomeField?: RecurringIncomeFieldResolvers<ContextType>;
  Report?: ReportResolvers<ContextType>;
  ReportCreationContext?: ReportCreationContextResolvers<ContextType>;
  ReportIntervalSnapshot?: ReportIntervalSnapshotResolvers<ContextType>;
  ReportPage?: ReportPageResolvers<ContextType>;
  ReportSlot?: ReportSlotResolvers<ContextType>;
  ReportTotals?: ReportTotalsResolvers<ContextType>;
  Shift?: ShiftResolvers<ContextType>;
  StockMovement?: StockMovementResolvers<ContextType>;
  StockMovementPage?: StockMovementPageResolvers<ContextType>;
  StockMovementPageInfo?: StockMovementPageInfoResolvers<ContextType>;
  TenantAccess?: TenantAccessResolvers<ContextType>;
  TenantSummary?: TenantSummaryResolvers<ContextType>;
  TimesheetDay?: TimesheetDayResolvers<ContextType>;
  TimesheetPage?: TimesheetPageResolvers<ContextType>;
  TimesheetUserSummary?: TimesheetUserSummaryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPage?: UserPageResolvers<ContextType>;
  UserTimesheet?: UserTimesheetResolvers<ContextType>;
};

