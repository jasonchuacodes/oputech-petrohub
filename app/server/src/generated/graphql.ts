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

export type CreateFuelProductInput = {
  name: Scalars['String']['input'];
  unitPrice: Scalars['Decimal']['input'];
};

export type CreatePumpMeterInput = {
  initialReading: Scalars['Decimal']['input'];
  label: Scalars['String']['input'];
  productId: Scalars['ObjectId']['input'];
};

export type CreateReportInput = {
  businessDate: Scalars['String']['input'];
  shiftId: Scalars['ObjectId']['input'];
};

export type CreateReportPayload = {
  __typename?: 'CreateReportPayload';
  created: Scalars['Boolean']['output'];
  report: Report;
};

export type CreateShiftInput = {
  endTime: Scalars['String']['input'];
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

export type FinancialEntry = {
  __typename?: 'FinancialEntry';
  amount: Scalars['Decimal']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
};

export type FinancialEntryInput = {
  amount: Scalars['Decimal']['input'];
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type FuelProduct = {
  __typename?: 'FuelProduct';
  id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  createFuelProduct: FuelProduct;
  createPumpMeter: PumpMeter;
  createReport: CreateReportPayload;
  createShift: Shift;
  createTenant: TenantSummary;
  createUser: User;
  deactivateFuelProduct: FuelProduct;
  deactivatePumpMeter: PumpMeter;
  deleteReport: Report;
  deleteShift: Scalars['Boolean']['output'];
  deleteTenant: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  resetUserPassword: User;
  saveReportDraft: Report;
  submitReport: Report;
  updateFuelProduct: FuelProduct;
  updateMyProfile: User;
  updateShift: Shift;
  updateTenant: TenantSummary;
  updateUser: User;
};


export type MutationCreateFuelProductArgs = {
  input: CreateFuelProductInput;
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


export type MutationResetUserPasswordArgs = {
  input: ResetUserPasswordInput;
};


export type MutationSaveReportDraftArgs = {
  input: SaveReportDraftInput;
};


export type MutationSubmitReportArgs = {
  input: ReportTransitionInput;
};


export type MutationUpdateFuelProductArgs = {
  input: UpdateFuelProductInput;
};


export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileInput;
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
  fuelSetup: FuelSetup;
  report: Report;
  reportCreationContext: ReportCreationContext;
  reports: ReportPage;
  shifts: Array<Shift>;
  tenants: Array<TenantAccess>;
  users: UserPage;
};


export type QueryReportArgs = {
  input: ReportInput;
};


export type QueryReportsArgs = {
  input: ReportsInput;
};


export type QueryUsersArgs = {
  input: UsersInput;
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
  revision: Scalars['Int']['output'];
  revocationReason?: Maybe<Scalars['String']['output']>;
  revokedAt?: Maybe<Scalars['String']['output']>;
  revokedById?: Maybe<Scalars['ObjectId']['output']>;
  revokedByName?: Maybe<Scalars['String']['output']>;
  revokedFromStatus?: Maybe<ReportStatus>;
  shiftId: Scalars['ObjectId']['output'];
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
  endTime: Scalars['String']['output'];
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
  overShort?: Maybe<Scalars['Decimal']['output']>;
  pumpSales?: Maybe<Scalars['Decimal']['output']>;
};

export type ReportTransitionInput = {
  expectedDisposalRevision: Scalars['Int']['input'];
  expectedReportRevision: Scalars['Int']['input'];
  reportId: Scalars['ObjectId']['input'];
};

export type ReportsInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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
  reportId: Scalars['ObjectId']['input'];
};

export type Shift = {
  __typename?: 'Shift';
  endTime: Scalars['String']['output'];
  id: Scalars['ObjectId']['output'];
  startTime: Scalars['String']['output'];
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

export type UpdateFuelProductInput = {
  expectedRevision: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  productId: Scalars['ObjectId']['input'];
  unitPrice: Scalars['Decimal']['input'];
};

export type UpdateMyProfileInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShiftInput = {
  endTime: Scalars['String']['input'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateFuelProductInput: CreateFuelProductInput;
  CreatePumpMeterInput: CreatePumpMeterInput;
  CreateReportInput: CreateReportInput;
  CreateReportPayload: ResolverTypeWrapper<CreateReportPayload>;
  CreateShiftInput: CreateShiftInput;
  CreateTenantInput: CreateTenantInput;
  CreateUserInput: CreateUserInput;
  DeactivateFuelSetupInput: DeactivateFuelSetupInput;
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
  FinancialEntry: ResolverTypeWrapper<FinancialEntry>;
  FinancialEntryInput: FinancialEntryInput;
  FuelProduct: ResolverTypeWrapper<FuelProduct>;
  FuelSetup: ResolverTypeWrapper<FuelSetup>;
  FuelSetupStatus: FuelSetupStatus;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  PumpMeter: ResolverTypeWrapper<PumpMeter>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
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
  Shift: ResolverTypeWrapper<Shift>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TenantAccess: ResolverTypeWrapper<TenantAccess>;
  TenantSummary: ResolverTypeWrapper<TenantSummary>;
  UpdateFuelProductInput: UpdateFuelProductInput;
  UpdateMyProfileInput: UpdateMyProfileInput;
  UpdateShiftInput: UpdateShiftInput;
  UpdateTenantInput: UpdateTenantInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserPage: ResolverTypeWrapper<UserPage>;
  UserRole: UserRole;
  UserStatus: UserStatus;
  UsersInput: UsersInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateFuelProductInput: CreateFuelProductInput;
  CreatePumpMeterInput: CreatePumpMeterInput;
  CreateReportInput: CreateReportInput;
  CreateReportPayload: CreateReportPayload;
  CreateShiftInput: CreateShiftInput;
  CreateTenantInput: CreateTenantInput;
  CreateUserInput: CreateUserInput;
  DeactivateFuelSetupInput: DeactivateFuelSetupInput;
  Decimal: Scalars['Decimal']['output'];
  DeleteReportInput: DeleteReportInput;
  DeleteShiftInput: DeleteShiftInput;
  DeleteTenantInput: DeleteTenantInput;
  DeleteUserInput: DeleteUserInput;
  DisposalBatch: DisposalBatch;
  DisposalReading: DisposalReading;
  EditableDisposalInput: EditableDisposalInput;
  FinancialEntry: FinancialEntry;
  FinancialEntryInput: FinancialEntryInput;
  FuelProduct: FuelProduct;
  FuelSetup: FuelSetup;
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  ObjectId: Scalars['ObjectId']['output'];
  PumpMeter: PumpMeter;
  Query: Record<PropertyKey, never>;
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
  Shift: Shift;
  String: Scalars['String']['output'];
  TenantAccess: TenantAccess;
  TenantSummary: TenantSummary;
  UpdateFuelProductInput: UpdateFuelProductInput;
  UpdateMyProfileInput: UpdateMyProfileInput;
  UpdateShiftInput: UpdateShiftInput;
  UpdateTenantInput: UpdateTenantInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserPage: UserPage;
  UsersInput: UsersInput;
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

export type FinancialEntryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FinancialEntry'] = ResolversParentTypes['FinancialEntry']> = {
  amount?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type FuelProductResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FuelProduct'] = ResolversParentTypes['FuelProduct']> = {
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['FuelSetupStatus'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
};

export type FuelSetupResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['FuelSetup'] = ResolversParentTypes['FuelSetup']> = {
  meters?: Resolver<Array<ResolversTypes['PumpMeter']>, ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['FuelProduct']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFuelProduct?: Resolver<ResolversTypes['FuelProduct'], ParentType, ContextType, RequireFields<MutationCreateFuelProductArgs, 'input'>>;
  createPumpMeter?: Resolver<ResolversTypes['PumpMeter'], ParentType, ContextType, RequireFields<MutationCreatePumpMeterArgs, 'input'>>;
  createReport?: Resolver<ResolversTypes['CreateReportPayload'], ParentType, ContextType, RequireFields<MutationCreateReportArgs, 'input'>>;
  createShift?: Resolver<ResolversTypes['Shift'], ParentType, ContextType, RequireFields<MutationCreateShiftArgs, 'input'>>;
  createTenant?: Resolver<ResolversTypes['TenantSummary'], ParentType, ContextType, RequireFields<MutationCreateTenantArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deactivateFuelProduct?: Resolver<ResolversTypes['FuelProduct'], ParentType, ContextType, RequireFields<MutationDeactivateFuelProductArgs, 'input'>>;
  deactivatePumpMeter?: Resolver<ResolversTypes['PumpMeter'], ParentType, ContextType, RequireFields<MutationDeactivatePumpMeterArgs, 'input'>>;
  deleteReport?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationDeleteReportArgs, 'input'>>;
  deleteShift?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteShiftArgs, 'input'>>;
  deleteTenant?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenantArgs, 'input'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'input'>>;
  resetUserPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetUserPasswordArgs, 'input'>>;
  saveReportDraft?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationSaveReportDraftArgs, 'input'>>;
  submitReport?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationSubmitReportArgs, 'input'>>;
  updateFuelProduct?: Resolver<ResolversTypes['FuelProduct'], ParentType, ContextType, RequireFields<MutationUpdateFuelProductArgs, 'input'>>;
  updateMyProfile?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateMyProfileArgs, 'input'>>;
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
  fuelSetup?: Resolver<ResolversTypes['FuelSetup'], ParentType, ContextType>;
  report?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<QueryReportArgs, 'input'>>;
  reportCreationContext?: Resolver<ResolversTypes['ReportCreationContext'], ParentType, ContextType>;
  reports?: Resolver<ResolversTypes['ReportPage'], ParentType, ContextType, RequireFields<QueryReportsArgs, 'input'>>;
  shifts?: Resolver<Array<ResolversTypes['Shift']>, ParentType, ContextType>;
  tenants?: Resolver<Array<ResolversTypes['TenantAccess']>, ParentType, ContextType>;
  users?: Resolver<ResolversTypes['UserPage'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'input'>>;
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
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revocationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revokedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revokedById?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  revokedByName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revokedFromStatus?: Resolver<Maybe<ResolversTypes['ReportStatus']>, ParentType, ContextType>;
  shiftId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
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
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  report?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType>;
  shift?: Resolver<ResolversTypes['Shift'], ParentType, ContextType>;
};

export type ReportTotalsResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['ReportTotals'] = ResolversParentTypes['ReportTotals']> = {
  cashFuelSales?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  expenses?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  income?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  overShort?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  pumpSales?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
};

export type ShiftResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Shift'] = ResolversParentTypes['Shift']> = {
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type Resolvers<ContextType = GraphqlContext> = {
  CreateReportPayload?: CreateReportPayloadResolvers<ContextType>;
  Decimal?: GraphQLScalarType;
  DisposalBatch?: DisposalBatchResolvers<ContextType>;
  DisposalReading?: DisposalReadingResolvers<ContextType>;
  FinancialEntry?: FinancialEntryResolvers<ContextType>;
  FuelProduct?: FuelProductResolvers<ContextType>;
  FuelSetup?: FuelSetupResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ObjectId?: GraphQLScalarType;
  PumpMeter?: PumpMeterResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Report?: ReportResolvers<ContextType>;
  ReportCreationContext?: ReportCreationContextResolvers<ContextType>;
  ReportIntervalSnapshot?: ReportIntervalSnapshotResolvers<ContextType>;
  ReportPage?: ReportPageResolvers<ContextType>;
  ReportSlot?: ReportSlotResolvers<ContextType>;
  ReportTotals?: ReportTotalsResolvers<ContextType>;
  Shift?: ShiftResolvers<ContextType>;
  TenantAccess?: TenantAccessResolvers<ContextType>;
  TenantSummary?: TenantSummaryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPage?: UserPageResolvers<ContextType>;
};

