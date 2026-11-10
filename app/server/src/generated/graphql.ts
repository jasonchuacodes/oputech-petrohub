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
  ObjectId: { input: Types.ObjectId; output: Types.ObjectId; }
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

export type DeleteShiftInput = {
  shiftId: Scalars['ObjectId']['input'];
};

export type DeleteTenantInput = {
  tenantId: Scalars['ObjectId']['input'];
};

export type DeleteUserInput = {
  userId: Scalars['ObjectId']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createReport: CreateReportPayload;
  createShift: Shift;
  createTenant: TenantSummary;
  createUser: User;
  deleteReport: Scalars['Boolean']['output'];
  deleteShift: Scalars['Boolean']['output'];
  deleteTenant: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  resetUserPassword: User;
  submitReport: Report;
  updateMyProfile: User;
  updateShift: Shift;
  updateTenant: TenantSummary;
  updateUser: User;
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


export type MutationDeleteReportArgs = {
  input: ReportRevisionInput;
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


export type MutationSubmitReportArgs = {
  input: ReportRevisionInput;
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

export type Query = {
  __typename?: 'Query';
  activeTenant?: Maybe<TenantSummary>;
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
  id: Scalars['ObjectId']['output'];
  interval: ReportIntervalSnapshot;
  revision: Scalars['Int']['output'];
  shiftId: Scalars['ObjectId']['output'];
  status: ReportStatus;
  submittedAt?: Maybe<Scalars['String']['output']>;
  submittedById?: Maybe<Scalars['ObjectId']['output']>;
  submittedByName?: Maybe<Scalars['String']['output']>;
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

export type ReportRevisionInput = {
  expectedRevision: Scalars['Int']['input'];
  reportId: Scalars['ObjectId']['input'];
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
  | 'submitted';

export type ReportsInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ResetUserPasswordInput = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['ObjectId']['input'];
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
  CreateReportInput: CreateReportInput;
  CreateReportPayload: ResolverTypeWrapper<CreateReportPayload>;
  CreateShiftInput: CreateShiftInput;
  CreateTenantInput: CreateTenantInput;
  CreateUserInput: CreateUserInput;
  DeleteShiftInput: DeleteShiftInput;
  DeleteTenantInput: DeleteTenantInput;
  DeleteUserInput: DeleteUserInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Report: ResolverTypeWrapper<Report>;
  ReportCreationContext: ResolverTypeWrapper<ReportCreationContext>;
  ReportInput: ReportInput;
  ReportIntervalSnapshot: ResolverTypeWrapper<ReportIntervalSnapshot>;
  ReportPage: ResolverTypeWrapper<ReportPage>;
  ReportRevisionInput: ReportRevisionInput;
  ReportSlot: ResolverTypeWrapper<ReportSlot>;
  ReportStatus: ReportStatus;
  ReportsInput: ReportsInput;
  ResetUserPasswordInput: ResetUserPasswordInput;
  Shift: ResolverTypeWrapper<Shift>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TenantAccess: ResolverTypeWrapper<TenantAccess>;
  TenantSummary: ResolverTypeWrapper<TenantSummary>;
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
  CreateReportInput: CreateReportInput;
  CreateReportPayload: CreateReportPayload;
  CreateShiftInput: CreateShiftInput;
  CreateTenantInput: CreateTenantInput;
  CreateUserInput: CreateUserInput;
  DeleteShiftInput: DeleteShiftInput;
  DeleteTenantInput: DeleteTenantInput;
  DeleteUserInput: DeleteUserInput;
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  ObjectId: Scalars['ObjectId']['output'];
  Query: Record<PropertyKey, never>;
  Report: Report;
  ReportCreationContext: ReportCreationContext;
  ReportInput: ReportInput;
  ReportIntervalSnapshot: ReportIntervalSnapshot;
  ReportPage: ReportPage;
  ReportRevisionInput: ReportRevisionInput;
  ReportSlot: ReportSlot;
  ReportsInput: ReportsInput;
  ResetUserPasswordInput: ResetUserPasswordInput;
  Shift: Shift;
  String: Scalars['String']['output'];
  TenantAccess: TenantAccess;
  TenantSummary: TenantSummary;
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

export type MutationResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createReport?: Resolver<ResolversTypes['CreateReportPayload'], ParentType, ContextType, RequireFields<MutationCreateReportArgs, 'input'>>;
  createShift?: Resolver<ResolversTypes['Shift'], ParentType, ContextType, RequireFields<MutationCreateShiftArgs, 'input'>>;
  createTenant?: Resolver<ResolversTypes['TenantSummary'], ParentType, ContextType, RequireFields<MutationCreateTenantArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteReport?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteReportArgs, 'input'>>;
  deleteShift?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteShiftArgs, 'input'>>;
  deleteTenant?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenantArgs, 'input'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'input'>>;
  resetUserPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetUserPasswordArgs, 'input'>>;
  submitReport?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationSubmitReportArgs, 'input'>>;
  updateMyProfile?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateMyProfileArgs, 'input'>>;
  updateShift?: Resolver<ResolversTypes['Shift'], ParentType, ContextType, RequireFields<MutationUpdateShiftArgs, 'input'>>;
  updateTenant?: Resolver<ResolversTypes['TenantSummary'], ParentType, ContextType, RequireFields<MutationUpdateTenantArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type QueryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeTenant?: Resolver<Maybe<ResolversTypes['TenantSummary']>, ParentType, ContextType>;
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
  id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  interval?: Resolver<ResolversTypes['ReportIntervalSnapshot'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shiftId?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReportStatus'], ParentType, ContextType>;
  submittedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  submittedById?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  submittedByName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  Mutation?: MutationResolvers<ContextType>;
  ObjectId?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Report?: ReportResolvers<ContextType>;
  ReportCreationContext?: ReportCreationContextResolvers<ContextType>;
  ReportIntervalSnapshot?: ReportIntervalSnapshotResolvers<ContextType>;
  ReportPage?: ReportPageResolvers<ContextType>;
  ReportSlot?: ReportSlotResolvers<ContextType>;
  Shift?: ShiftResolvers<ContextType>;
  TenantAccess?: TenantAccessResolvers<ContextType>;
  TenantSummary?: TenantSummaryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPage?: UserPageResolvers<ContextType>;
};

