
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model TenantsOnUsers
 * 
 */
export type TenantsOnUsers = $Result.DefaultSelection<Prisma.$TenantsOnUsersPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model Timesheet
 * 
 */
export type Timesheet = $Result.DefaultSelection<Prisma.$TimesheetPayload>
/**
 * Model TimesheetEntry
 * 
 */
export type TimesheetEntry = $Result.DefaultSelection<Prisma.$TimesheetEntryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const TimesheetStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type TimesheetStatus = (typeof TimesheetStatus)[keyof typeof TimesheetStatus]


export const TimesheetEntryAction: {
  CHECK_IN: 'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT'
};

export type TimesheetEntryAction = (typeof TimesheetEntryAction)[keyof typeof TimesheetEntryAction]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type TimesheetStatus = $Enums.TimesheetStatus

export const TimesheetStatus: typeof $Enums.TimesheetStatus

export type TimesheetEntryAction = $Enums.TimesheetEntryAction

export const TimesheetEntryAction: typeof $Enums.TimesheetEntryAction

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantsOnUsers`: Exposes CRUD operations for the **TenantsOnUsers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantsOnUsers
    * const tenantsOnUsers = await prisma.tenantsOnUsers.findMany()
    * ```
    */
  get tenantsOnUsers(): Prisma.TenantsOnUsersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.timesheet`: Exposes CRUD operations for the **Timesheet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Timesheets
    * const timesheets = await prisma.timesheet.findMany()
    * ```
    */
  get timesheet(): Prisma.TimesheetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.timesheetEntry`: Exposes CRUD operations for the **TimesheetEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TimesheetEntries
    * const timesheetEntries = await prisma.timesheetEntry.findMany()
    * ```
    */
  get timesheetEntry(): Prisma.TimesheetEntryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.11.1
   * Query Engine version: f40f79ec31188888a2e33acda0ecc8fd10a853a9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Tenant: 'Tenant',
    TenantsOnUsers: 'TenantsOnUsers',
    Session: 'Session',
    Document: 'Document',
    Timesheet: 'Timesheet',
    TimesheetEntry: 'TimesheetEntry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "tenant" | "tenantsOnUsers" | "session" | "document" | "timesheet" | "timesheetEntry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      TenantsOnUsers: {
        payload: Prisma.$TenantsOnUsersPayload<ExtArgs>
        fields: Prisma.TenantsOnUsersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantsOnUsersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantsOnUsersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>
          }
          findFirst: {
            args: Prisma.TenantsOnUsersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantsOnUsersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>
          }
          findMany: {
            args: Prisma.TenantsOnUsersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>[]
          }
          create: {
            args: Prisma.TenantsOnUsersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>
          }
          createMany: {
            args: Prisma.TenantsOnUsersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantsOnUsersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>[]
          }
          delete: {
            args: Prisma.TenantsOnUsersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>
          }
          update: {
            args: Prisma.TenantsOnUsersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>
          }
          deleteMany: {
            args: Prisma.TenantsOnUsersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantsOnUsersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantsOnUsersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>[]
          }
          upsert: {
            args: Prisma.TenantsOnUsersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantsOnUsersPayload>
          }
          aggregate: {
            args: Prisma.TenantsOnUsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantsOnUsers>
          }
          groupBy: {
            args: Prisma.TenantsOnUsersGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantsOnUsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantsOnUsersCountArgs<ExtArgs>
            result: $Utils.Optional<TenantsOnUsersCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      Timesheet: {
        payload: Prisma.$TimesheetPayload<ExtArgs>
        fields: Prisma.TimesheetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TimesheetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TimesheetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>
          }
          findFirst: {
            args: Prisma.TimesheetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TimesheetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>
          }
          findMany: {
            args: Prisma.TimesheetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>[]
          }
          create: {
            args: Prisma.TimesheetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>
          }
          createMany: {
            args: Prisma.TimesheetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TimesheetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>[]
          }
          delete: {
            args: Prisma.TimesheetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>
          }
          update: {
            args: Prisma.TimesheetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>
          }
          deleteMany: {
            args: Prisma.TimesheetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TimesheetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TimesheetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>[]
          }
          upsert: {
            args: Prisma.TimesheetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetPayload>
          }
          aggregate: {
            args: Prisma.TimesheetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTimesheet>
          }
          groupBy: {
            args: Prisma.TimesheetGroupByArgs<ExtArgs>
            result: $Utils.Optional<TimesheetGroupByOutputType>[]
          }
          count: {
            args: Prisma.TimesheetCountArgs<ExtArgs>
            result: $Utils.Optional<TimesheetCountAggregateOutputType> | number
          }
        }
      }
      TimesheetEntry: {
        payload: Prisma.$TimesheetEntryPayload<ExtArgs>
        fields: Prisma.TimesheetEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TimesheetEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TimesheetEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>
          }
          findFirst: {
            args: Prisma.TimesheetEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TimesheetEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>
          }
          findMany: {
            args: Prisma.TimesheetEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>[]
          }
          create: {
            args: Prisma.TimesheetEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>
          }
          createMany: {
            args: Prisma.TimesheetEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TimesheetEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>[]
          }
          delete: {
            args: Prisma.TimesheetEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>
          }
          update: {
            args: Prisma.TimesheetEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>
          }
          deleteMany: {
            args: Prisma.TimesheetEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TimesheetEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TimesheetEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>[]
          }
          upsert: {
            args: Prisma.TimesheetEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimesheetEntryPayload>
          }
          aggregate: {
            args: Prisma.TimesheetEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTimesheetEntry>
          }
          groupBy: {
            args: Prisma.TimesheetEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<TimesheetEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.TimesheetEntryCountArgs<ExtArgs>
            result: $Utils.Optional<TimesheetEntryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    tenant?: TenantOmit
    tenantsOnUsers?: TenantsOnUsersOmit
    session?: SessionOmit
    document?: DocumentOmit
    timesheet?: TimesheetOmit
    timesheetEntry?: TimesheetEntryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    timesheets: number
    tenants: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    timesheets?: boolean | UserCountOutputTypeCountTimesheetsArgs
    tenants?: boolean | UserCountOutputTypeCountTenantsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTimesheetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimesheetWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantsOnUsersWhereInput
  }


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    documents: number
    users: number
    timesheets: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | TenantCountOutputTypeCountDocumentsArgs
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    timesheets?: boolean | TenantCountOutputTypeCountTimesheetsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantsOnUsersWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountTimesheetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimesheetWhereInput
  }


  /**
   * Count Type TimesheetCountOutputType
   */

  export type TimesheetCountOutputType = {
    entries: number
  }

  export type TimesheetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entries?: boolean | TimesheetCountOutputTypeCountEntriesArgs
  }

  // Custom InputTypes
  /**
   * TimesheetCountOutputType without action
   */
  export type TimesheetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetCountOutputType
     */
    select?: TimesheetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TimesheetCountOutputType without action
   */
  export type TimesheetCountOutputTypeCountEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimesheetEntryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    name: string | null
    password: string | null
    role: $Enums.Role | null
    birthday: Date | null
    contact: string | null
    address: string | null
    sss: string | null
    tin: string | null
    philhealth: string | null
    pagibig: string | null
    shouldChangePassword: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    name: string | null
    password: string | null
    role: $Enums.Role | null
    birthday: Date | null
    contact: string | null
    address: string | null
    sss: string | null
    tin: string | null
    philhealth: string | null
    pagibig: string | null
    shouldChangePassword: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    email: number
    name: number
    password: number
    role: number
    birthday: number
    contact: number
    address: number
    sss: number
    tin: number
    philhealth: number
    pagibig: number
    shouldChangePassword: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    name?: true
    password?: true
    role?: true
    birthday?: true
    contact?: true
    address?: true
    sss?: true
    tin?: true
    philhealth?: true
    pagibig?: true
    shouldChangePassword?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    name?: true
    password?: true
    role?: true
    birthday?: true
    contact?: true
    address?: true
    sss?: true
    tin?: true
    philhealth?: true
    pagibig?: true
    shouldChangePassword?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    name?: true
    password?: true
    role?: true
    birthday?: true
    contact?: true
    address?: true
    sss?: true
    tin?: true
    philhealth?: true
    pagibig?: true
    shouldChangePassword?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    email: string | null
    name: string
    password: string
    role: $Enums.Role
    birthday: Date | null
    contact: string | null
    address: string | null
    sss: string | null
    tin: string | null
    philhealth: string | null
    pagibig: string | null
    shouldChangePassword: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    birthday?: boolean
    contact?: boolean
    address?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    shouldChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    timesheets?: boolean | User$timesheetsArgs<ExtArgs>
    tenants?: boolean | User$tenantsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    birthday?: boolean
    contact?: boolean
    address?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    shouldChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    birthday?: boolean
    contact?: boolean
    address?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    shouldChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    birthday?: boolean
    contact?: boolean
    address?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    shouldChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "email" | "name" | "password" | "role" | "birthday" | "contact" | "address" | "sss" | "tin" | "philhealth" | "pagibig" | "shouldChangePassword" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    timesheets?: boolean | User$timesheetsArgs<ExtArgs>
    tenants?: boolean | User$tenantsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      timesheets: Prisma.$TimesheetPayload<ExtArgs>[]
      tenants: Prisma.$TenantsOnUsersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string | null
      name: string
      password: string
      role: $Enums.Role
      birthday: Date | null
      contact: string | null
      address: string | null
      sss: string | null
      tin: string | null
      philhealth: string | null
      pagibig: string | null
      shouldChangePassword: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    timesheets<T extends User$timesheetsArgs<ExtArgs> = {}>(args?: Subset<T, User$timesheetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tenants<T extends User$tenantsArgs<ExtArgs> = {}>(args?: Subset<T, User$tenantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly birthday: FieldRef<"User", 'DateTime'>
    readonly contact: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly sss: FieldRef<"User", 'String'>
    readonly tin: FieldRef<"User", 'String'>
    readonly philhealth: FieldRef<"User", 'String'>
    readonly pagibig: FieldRef<"User", 'String'>
    readonly shouldChangePassword: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.timesheets
   */
  export type User$timesheetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    where?: TimesheetWhereInput
    orderBy?: TimesheetOrderByWithRelationInput | TimesheetOrderByWithRelationInput[]
    cursor?: TimesheetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TimesheetScalarFieldEnum | TimesheetScalarFieldEnum[]
  }

  /**
   * User.tenants
   */
  export type User$tenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    where?: TenantsOnUsersWhereInput
    orderBy?: TenantsOnUsersOrderByWithRelationInput | TenantsOnUsersOrderByWithRelationInput[]
    cursor?: TenantsOnUsersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantsOnUsersScalarFieldEnum | TenantsOnUsersScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    contact: string | null
    address: string | null
    description: string | null
    sss: string | null
    tin: string | null
    philhealth: string | null
    pagibig: string | null
    logoUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    contact: string | null
    address: string | null
    description: string | null
    sss: string | null
    tin: string | null
    philhealth: string | null
    pagibig: string | null
    logoUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    email: number
    contact: number
    address: number
    description: number
    sss: number
    tin: number
    philhealth: number
    pagibig: number
    logoUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    contact?: true
    address?: true
    description?: true
    sss?: true
    tin?: true
    philhealth?: true
    pagibig?: true
    logoUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    contact?: true
    address?: true
    description?: true
    sss?: true
    tin?: true
    philhealth?: true
    pagibig?: true
    logoUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    contact?: true
    address?: true
    description?: true
    sss?: true
    tin?: true
    philhealth?: true
    pagibig?: true
    logoUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    email: string
    contact: string
    address: string | null
    description: string | null
    sss: string | null
    tin: string | null
    philhealth: string | null
    pagibig: string | null
    logoUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    address?: boolean
    description?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    documents?: boolean | Tenant$documentsArgs<ExtArgs>
    users?: boolean | Tenant$usersArgs<ExtArgs>
    timesheets?: boolean | Tenant$timesheetsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    address?: boolean
    description?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    address?: boolean
    description?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    contact?: boolean
    address?: boolean
    description?: boolean
    sss?: boolean
    tin?: boolean
    philhealth?: boolean
    pagibig?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "contact" | "address" | "description" | "sss" | "tin" | "philhealth" | "pagibig" | "logoUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | Tenant$documentsArgs<ExtArgs>
    users?: boolean | Tenant$usersArgs<ExtArgs>
    timesheets?: boolean | Tenant$timesheetsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      users: Prisma.$TenantsOnUsersPayload<ExtArgs>[]
      timesheets: Prisma.$TimesheetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      contact: string
      address: string | null
      description: string | null
      sss: string | null
      tin: string | null
      philhealth: string | null
      pagibig: string | null
      logoUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    documents<T extends Tenant$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    timesheets<T extends Tenant$timesheetsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$timesheetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly email: FieldRef<"Tenant", 'String'>
    readonly contact: FieldRef<"Tenant", 'String'>
    readonly address: FieldRef<"Tenant", 'String'>
    readonly description: FieldRef<"Tenant", 'String'>
    readonly sss: FieldRef<"Tenant", 'String'>
    readonly tin: FieldRef<"Tenant", 'String'>
    readonly philhealth: FieldRef<"Tenant", 'String'>
    readonly pagibig: FieldRef<"Tenant", 'String'>
    readonly logoUrl: FieldRef<"Tenant", 'String'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.documents
   */
  export type Tenant$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    where?: TenantsOnUsersWhereInput
    orderBy?: TenantsOnUsersOrderByWithRelationInput | TenantsOnUsersOrderByWithRelationInput[]
    cursor?: TenantsOnUsersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantsOnUsersScalarFieldEnum | TenantsOnUsersScalarFieldEnum[]
  }

  /**
   * Tenant.timesheets
   */
  export type Tenant$timesheetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    where?: TimesheetWhereInput
    orderBy?: TimesheetOrderByWithRelationInput | TimesheetOrderByWithRelationInput[]
    cursor?: TimesheetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TimesheetScalarFieldEnum | TimesheetScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model TenantsOnUsers
   */

  export type AggregateTenantsOnUsers = {
    _count: TenantsOnUsersCountAggregateOutputType | null
    _min: TenantsOnUsersMinAggregateOutputType | null
    _max: TenantsOnUsersMaxAggregateOutputType | null
  }

  export type TenantsOnUsersMinAggregateOutputType = {
    userId: string | null
    tenantId: string | null
  }

  export type TenantsOnUsersMaxAggregateOutputType = {
    userId: string | null
    tenantId: string | null
  }

  export type TenantsOnUsersCountAggregateOutputType = {
    userId: number
    tenantId: number
    _all: number
  }


  export type TenantsOnUsersMinAggregateInputType = {
    userId?: true
    tenantId?: true
  }

  export type TenantsOnUsersMaxAggregateInputType = {
    userId?: true
    tenantId?: true
  }

  export type TenantsOnUsersCountAggregateInputType = {
    userId?: true
    tenantId?: true
    _all?: true
  }

  export type TenantsOnUsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantsOnUsers to aggregate.
     */
    where?: TenantsOnUsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantsOnUsers to fetch.
     */
    orderBy?: TenantsOnUsersOrderByWithRelationInput | TenantsOnUsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantsOnUsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantsOnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantsOnUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantsOnUsers
    **/
    _count?: true | TenantsOnUsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantsOnUsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantsOnUsersMaxAggregateInputType
  }

  export type GetTenantsOnUsersAggregateType<T extends TenantsOnUsersAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantsOnUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantsOnUsers[P]>
      : GetScalarType<T[P], AggregateTenantsOnUsers[P]>
  }




  export type TenantsOnUsersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantsOnUsersWhereInput
    orderBy?: TenantsOnUsersOrderByWithAggregationInput | TenantsOnUsersOrderByWithAggregationInput[]
    by: TenantsOnUsersScalarFieldEnum[] | TenantsOnUsersScalarFieldEnum
    having?: TenantsOnUsersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantsOnUsersCountAggregateInputType | true
    _min?: TenantsOnUsersMinAggregateInputType
    _max?: TenantsOnUsersMaxAggregateInputType
  }

  export type TenantsOnUsersGroupByOutputType = {
    userId: string
    tenantId: string
    _count: TenantsOnUsersCountAggregateOutputType | null
    _min: TenantsOnUsersMinAggregateOutputType | null
    _max: TenantsOnUsersMaxAggregateOutputType | null
  }

  type GetTenantsOnUsersGroupByPayload<T extends TenantsOnUsersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantsOnUsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantsOnUsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantsOnUsersGroupByOutputType[P]>
            : GetScalarType<T[P], TenantsOnUsersGroupByOutputType[P]>
        }
      >
    >


  export type TenantsOnUsersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    tenantId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantsOnUsers"]>

  export type TenantsOnUsersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    tenantId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantsOnUsers"]>

  export type TenantsOnUsersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    tenantId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantsOnUsers"]>

  export type TenantsOnUsersSelectScalar = {
    userId?: boolean
    tenantId?: boolean
  }

  export type TenantsOnUsersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "tenantId", ExtArgs["result"]["tenantsOnUsers"]>
  export type TenantsOnUsersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantsOnUsersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantsOnUsersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantsOnUsersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantsOnUsers"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      tenantId: string
    }, ExtArgs["result"]["tenantsOnUsers"]>
    composites: {}
  }

  type TenantsOnUsersGetPayload<S extends boolean | null | undefined | TenantsOnUsersDefaultArgs> = $Result.GetResult<Prisma.$TenantsOnUsersPayload, S>

  type TenantsOnUsersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantsOnUsersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantsOnUsersCountAggregateInputType | true
    }

  export interface TenantsOnUsersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantsOnUsers'], meta: { name: 'TenantsOnUsers' } }
    /**
     * Find zero or one TenantsOnUsers that matches the filter.
     * @param {TenantsOnUsersFindUniqueArgs} args - Arguments to find a TenantsOnUsers
     * @example
     * // Get one TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantsOnUsersFindUniqueArgs>(args: SelectSubset<T, TenantsOnUsersFindUniqueArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantsOnUsers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantsOnUsersFindUniqueOrThrowArgs} args - Arguments to find a TenantsOnUsers
     * @example
     * // Get one TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantsOnUsersFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantsOnUsersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantsOnUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantsOnUsersFindFirstArgs} args - Arguments to find a TenantsOnUsers
     * @example
     * // Get one TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantsOnUsersFindFirstArgs>(args?: SelectSubset<T, TenantsOnUsersFindFirstArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantsOnUsers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantsOnUsersFindFirstOrThrowArgs} args - Arguments to find a TenantsOnUsers
     * @example
     * // Get one TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantsOnUsersFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantsOnUsersFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantsOnUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantsOnUsersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.findMany()
     * 
     * // Get first 10 TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const tenantsOnUsersWithUserIdOnly = await prisma.tenantsOnUsers.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends TenantsOnUsersFindManyArgs>(args?: SelectSubset<T, TenantsOnUsersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantsOnUsers.
     * @param {TenantsOnUsersCreateArgs} args - Arguments to create a TenantsOnUsers.
     * @example
     * // Create one TenantsOnUsers
     * const TenantsOnUsers = await prisma.tenantsOnUsers.create({
     *   data: {
     *     // ... data to create a TenantsOnUsers
     *   }
     * })
     * 
     */
    create<T extends TenantsOnUsersCreateArgs>(args: SelectSubset<T, TenantsOnUsersCreateArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantsOnUsers.
     * @param {TenantsOnUsersCreateManyArgs} args - Arguments to create many TenantsOnUsers.
     * @example
     * // Create many TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantsOnUsersCreateManyArgs>(args?: SelectSubset<T, TenantsOnUsersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantsOnUsers and returns the data saved in the database.
     * @param {TenantsOnUsersCreateManyAndReturnArgs} args - Arguments to create many TenantsOnUsers.
     * @example
     * // Create many TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantsOnUsers and only return the `userId`
     * const tenantsOnUsersWithUserIdOnly = await prisma.tenantsOnUsers.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantsOnUsersCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantsOnUsersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantsOnUsers.
     * @param {TenantsOnUsersDeleteArgs} args - Arguments to delete one TenantsOnUsers.
     * @example
     * // Delete one TenantsOnUsers
     * const TenantsOnUsers = await prisma.tenantsOnUsers.delete({
     *   where: {
     *     // ... filter to delete one TenantsOnUsers
     *   }
     * })
     * 
     */
    delete<T extends TenantsOnUsersDeleteArgs>(args: SelectSubset<T, TenantsOnUsersDeleteArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantsOnUsers.
     * @param {TenantsOnUsersUpdateArgs} args - Arguments to update one TenantsOnUsers.
     * @example
     * // Update one TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantsOnUsersUpdateArgs>(args: SelectSubset<T, TenantsOnUsersUpdateArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantsOnUsers.
     * @param {TenantsOnUsersDeleteManyArgs} args - Arguments to filter TenantsOnUsers to delete.
     * @example
     * // Delete a few TenantsOnUsers
     * const { count } = await prisma.tenantsOnUsers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantsOnUsersDeleteManyArgs>(args?: SelectSubset<T, TenantsOnUsersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantsOnUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantsOnUsersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantsOnUsersUpdateManyArgs>(args: SelectSubset<T, TenantsOnUsersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantsOnUsers and returns the data updated in the database.
     * @param {TenantsOnUsersUpdateManyAndReturnArgs} args - Arguments to update many TenantsOnUsers.
     * @example
     * // Update many TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantsOnUsers and only return the `userId`
     * const tenantsOnUsersWithUserIdOnly = await prisma.tenantsOnUsers.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantsOnUsersUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantsOnUsersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantsOnUsers.
     * @param {TenantsOnUsersUpsertArgs} args - Arguments to update or create a TenantsOnUsers.
     * @example
     * // Update or create a TenantsOnUsers
     * const tenantsOnUsers = await prisma.tenantsOnUsers.upsert({
     *   create: {
     *     // ... data to create a TenantsOnUsers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantsOnUsers we want to update
     *   }
     * })
     */
    upsert<T extends TenantsOnUsersUpsertArgs>(args: SelectSubset<T, TenantsOnUsersUpsertArgs<ExtArgs>>): Prisma__TenantsOnUsersClient<$Result.GetResult<Prisma.$TenantsOnUsersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantsOnUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantsOnUsersCountArgs} args - Arguments to filter TenantsOnUsers to count.
     * @example
     * // Count the number of TenantsOnUsers
     * const count = await prisma.tenantsOnUsers.count({
     *   where: {
     *     // ... the filter for the TenantsOnUsers we want to count
     *   }
     * })
    **/
    count<T extends TenantsOnUsersCountArgs>(
      args?: Subset<T, TenantsOnUsersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantsOnUsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantsOnUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantsOnUsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantsOnUsersAggregateArgs>(args: Subset<T, TenantsOnUsersAggregateArgs>): Prisma.PrismaPromise<GetTenantsOnUsersAggregateType<T>>

    /**
     * Group by TenantsOnUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantsOnUsersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantsOnUsersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantsOnUsersGroupByArgs['orderBy'] }
        : { orderBy?: TenantsOnUsersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantsOnUsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantsOnUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantsOnUsers model
   */
  readonly fields: TenantsOnUsersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantsOnUsers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantsOnUsersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantsOnUsers model
   */
  interface TenantsOnUsersFieldRefs {
    readonly userId: FieldRef<"TenantsOnUsers", 'String'>
    readonly tenantId: FieldRef<"TenantsOnUsers", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TenantsOnUsers findUnique
   */
  export type TenantsOnUsersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * Filter, which TenantsOnUsers to fetch.
     */
    where: TenantsOnUsersWhereUniqueInput
  }

  /**
   * TenantsOnUsers findUniqueOrThrow
   */
  export type TenantsOnUsersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * Filter, which TenantsOnUsers to fetch.
     */
    where: TenantsOnUsersWhereUniqueInput
  }

  /**
   * TenantsOnUsers findFirst
   */
  export type TenantsOnUsersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * Filter, which TenantsOnUsers to fetch.
     */
    where?: TenantsOnUsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantsOnUsers to fetch.
     */
    orderBy?: TenantsOnUsersOrderByWithRelationInput | TenantsOnUsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantsOnUsers.
     */
    cursor?: TenantsOnUsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantsOnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantsOnUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantsOnUsers.
     */
    distinct?: TenantsOnUsersScalarFieldEnum | TenantsOnUsersScalarFieldEnum[]
  }

  /**
   * TenantsOnUsers findFirstOrThrow
   */
  export type TenantsOnUsersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * Filter, which TenantsOnUsers to fetch.
     */
    where?: TenantsOnUsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantsOnUsers to fetch.
     */
    orderBy?: TenantsOnUsersOrderByWithRelationInput | TenantsOnUsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantsOnUsers.
     */
    cursor?: TenantsOnUsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantsOnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantsOnUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantsOnUsers.
     */
    distinct?: TenantsOnUsersScalarFieldEnum | TenantsOnUsersScalarFieldEnum[]
  }

  /**
   * TenantsOnUsers findMany
   */
  export type TenantsOnUsersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * Filter, which TenantsOnUsers to fetch.
     */
    where?: TenantsOnUsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantsOnUsers to fetch.
     */
    orderBy?: TenantsOnUsersOrderByWithRelationInput | TenantsOnUsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantsOnUsers.
     */
    cursor?: TenantsOnUsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantsOnUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantsOnUsers.
     */
    skip?: number
    distinct?: TenantsOnUsersScalarFieldEnum | TenantsOnUsersScalarFieldEnum[]
  }

  /**
   * TenantsOnUsers create
   */
  export type TenantsOnUsersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantsOnUsers.
     */
    data: XOR<TenantsOnUsersCreateInput, TenantsOnUsersUncheckedCreateInput>
  }

  /**
   * TenantsOnUsers createMany
   */
  export type TenantsOnUsersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantsOnUsers.
     */
    data: TenantsOnUsersCreateManyInput | TenantsOnUsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantsOnUsers createManyAndReturn
   */
  export type TenantsOnUsersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * The data used to create many TenantsOnUsers.
     */
    data: TenantsOnUsersCreateManyInput | TenantsOnUsersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantsOnUsers update
   */
  export type TenantsOnUsersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantsOnUsers.
     */
    data: XOR<TenantsOnUsersUpdateInput, TenantsOnUsersUncheckedUpdateInput>
    /**
     * Choose, which TenantsOnUsers to update.
     */
    where: TenantsOnUsersWhereUniqueInput
  }

  /**
   * TenantsOnUsers updateMany
   */
  export type TenantsOnUsersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantsOnUsers.
     */
    data: XOR<TenantsOnUsersUpdateManyMutationInput, TenantsOnUsersUncheckedUpdateManyInput>
    /**
     * Filter which TenantsOnUsers to update
     */
    where?: TenantsOnUsersWhereInput
    /**
     * Limit how many TenantsOnUsers to update.
     */
    limit?: number
  }

  /**
   * TenantsOnUsers updateManyAndReturn
   */
  export type TenantsOnUsersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * The data used to update TenantsOnUsers.
     */
    data: XOR<TenantsOnUsersUpdateManyMutationInput, TenantsOnUsersUncheckedUpdateManyInput>
    /**
     * Filter which TenantsOnUsers to update
     */
    where?: TenantsOnUsersWhereInput
    /**
     * Limit how many TenantsOnUsers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantsOnUsers upsert
   */
  export type TenantsOnUsersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantsOnUsers to update in case it exists.
     */
    where: TenantsOnUsersWhereUniqueInput
    /**
     * In case the TenantsOnUsers found by the `where` argument doesn't exist, create a new TenantsOnUsers with this data.
     */
    create: XOR<TenantsOnUsersCreateInput, TenantsOnUsersUncheckedCreateInput>
    /**
     * In case the TenantsOnUsers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantsOnUsersUpdateInput, TenantsOnUsersUncheckedUpdateInput>
  }

  /**
   * TenantsOnUsers delete
   */
  export type TenantsOnUsersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
    /**
     * Filter which TenantsOnUsers to delete.
     */
    where: TenantsOnUsersWhereUniqueInput
  }

  /**
   * TenantsOnUsers deleteMany
   */
  export type TenantsOnUsersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantsOnUsers to delete
     */
    where?: TenantsOnUsersWhereInput
    /**
     * Limit how many TenantsOnUsers to delete.
     */
    limit?: number
  }

  /**
   * TenantsOnUsers without action
   */
  export type TenantsOnUsersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantsOnUsers
     */
    select?: TenantsOnUsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantsOnUsers
     */
    omit?: TenantsOnUsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantsOnUsersInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshTokenHash: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshTokenHash: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    refreshTokenHash: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    refreshTokenHash: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "refreshTokenHash" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      refreshTokenHash: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly refreshTokenHash: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    url: string | null
    uploadedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    url: string | null
    uploadedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    url: number
    uploadedAt: number
    _all: number
  }


  export type DocumentMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    url?: true
    uploadedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    url?: true
    uploadedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    url?: true
    uploadedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    tenantId: string
    name: string
    url: string
    uploadedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    url?: boolean
    uploadedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    url?: boolean
    uploadedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    url?: boolean
    uploadedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    url?: boolean
    uploadedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "url" | "uploadedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      name: string
      url: string
      uploadedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly tenantId: FieldRef<"Document", 'String'>
    readonly name: FieldRef<"Document", 'String'>
    readonly url: FieldRef<"Document", 'String'>
    readonly uploadedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model Timesheet
   */

  export type AggregateTimesheet = {
    _count: TimesheetCountAggregateOutputType | null
    _avg: TimesheetAvgAggregateOutputType | null
    _sum: TimesheetSumAggregateOutputType | null
    _min: TimesheetMinAggregateOutputType | null
    _max: TimesheetMaxAggregateOutputType | null
  }

  export type TimesheetAvgAggregateOutputType = {
    totalHours: number | null
  }

  export type TimesheetSumAggregateOutputType = {
    totalHours: number | null
  }

  export type TimesheetMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tenantId: string | null
    totalHours: number | null
    status: $Enums.TimesheetStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TimesheetMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tenantId: string | null
    totalHours: number | null
    status: $Enums.TimesheetStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TimesheetCountAggregateOutputType = {
    id: number
    userId: number
    tenantId: number
    totalHours: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TimesheetAvgAggregateInputType = {
    totalHours?: true
  }

  export type TimesheetSumAggregateInputType = {
    totalHours?: true
  }

  export type TimesheetMinAggregateInputType = {
    id?: true
    userId?: true
    tenantId?: true
    totalHours?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TimesheetMaxAggregateInputType = {
    id?: true
    userId?: true
    tenantId?: true
    totalHours?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TimesheetCountAggregateInputType = {
    id?: true
    userId?: true
    tenantId?: true
    totalHours?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TimesheetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Timesheet to aggregate.
     */
    where?: TimesheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Timesheets to fetch.
     */
    orderBy?: TimesheetOrderByWithRelationInput | TimesheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TimesheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Timesheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Timesheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Timesheets
    **/
    _count?: true | TimesheetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TimesheetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TimesheetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TimesheetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TimesheetMaxAggregateInputType
  }

  export type GetTimesheetAggregateType<T extends TimesheetAggregateArgs> = {
        [P in keyof T & keyof AggregateTimesheet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTimesheet[P]>
      : GetScalarType<T[P], AggregateTimesheet[P]>
  }




  export type TimesheetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimesheetWhereInput
    orderBy?: TimesheetOrderByWithAggregationInput | TimesheetOrderByWithAggregationInput[]
    by: TimesheetScalarFieldEnum[] | TimesheetScalarFieldEnum
    having?: TimesheetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TimesheetCountAggregateInputType | true
    _avg?: TimesheetAvgAggregateInputType
    _sum?: TimesheetSumAggregateInputType
    _min?: TimesheetMinAggregateInputType
    _max?: TimesheetMaxAggregateInputType
  }

  export type TimesheetGroupByOutputType = {
    id: string
    userId: string
    tenantId: string
    totalHours: number
    status: $Enums.TimesheetStatus
    createdAt: Date
    updatedAt: Date
    _count: TimesheetCountAggregateOutputType | null
    _avg: TimesheetAvgAggregateOutputType | null
    _sum: TimesheetSumAggregateOutputType | null
    _min: TimesheetMinAggregateOutputType | null
    _max: TimesheetMaxAggregateOutputType | null
  }

  type GetTimesheetGroupByPayload<T extends TimesheetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TimesheetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TimesheetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TimesheetGroupByOutputType[P]>
            : GetScalarType<T[P], TimesheetGroupByOutputType[P]>
        }
      >
    >


  export type TimesheetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tenantId?: boolean
    totalHours?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    entries?: boolean | Timesheet$entriesArgs<ExtArgs>
    _count?: boolean | TimesheetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timesheet"]>

  export type TimesheetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tenantId?: boolean
    totalHours?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timesheet"]>

  export type TimesheetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tenantId?: boolean
    totalHours?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timesheet"]>

  export type TimesheetSelectScalar = {
    id?: boolean
    userId?: boolean
    tenantId?: boolean
    totalHours?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TimesheetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tenantId" | "totalHours" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["timesheet"]>
  export type TimesheetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    entries?: boolean | Timesheet$entriesArgs<ExtArgs>
    _count?: boolean | TimesheetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TimesheetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TimesheetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TimesheetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Timesheet"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
      entries: Prisma.$TimesheetEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tenantId: string
      totalHours: number
      status: $Enums.TimesheetStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["timesheet"]>
    composites: {}
  }

  type TimesheetGetPayload<S extends boolean | null | undefined | TimesheetDefaultArgs> = $Result.GetResult<Prisma.$TimesheetPayload, S>

  type TimesheetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TimesheetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TimesheetCountAggregateInputType | true
    }

  export interface TimesheetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Timesheet'], meta: { name: 'Timesheet' } }
    /**
     * Find zero or one Timesheet that matches the filter.
     * @param {TimesheetFindUniqueArgs} args - Arguments to find a Timesheet
     * @example
     * // Get one Timesheet
     * const timesheet = await prisma.timesheet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TimesheetFindUniqueArgs>(args: SelectSubset<T, TimesheetFindUniqueArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Timesheet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TimesheetFindUniqueOrThrowArgs} args - Arguments to find a Timesheet
     * @example
     * // Get one Timesheet
     * const timesheet = await prisma.timesheet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TimesheetFindUniqueOrThrowArgs>(args: SelectSubset<T, TimesheetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Timesheet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetFindFirstArgs} args - Arguments to find a Timesheet
     * @example
     * // Get one Timesheet
     * const timesheet = await prisma.timesheet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TimesheetFindFirstArgs>(args?: SelectSubset<T, TimesheetFindFirstArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Timesheet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetFindFirstOrThrowArgs} args - Arguments to find a Timesheet
     * @example
     * // Get one Timesheet
     * const timesheet = await prisma.timesheet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TimesheetFindFirstOrThrowArgs>(args?: SelectSubset<T, TimesheetFindFirstOrThrowArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Timesheets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Timesheets
     * const timesheets = await prisma.timesheet.findMany()
     * 
     * // Get first 10 Timesheets
     * const timesheets = await prisma.timesheet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const timesheetWithIdOnly = await prisma.timesheet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TimesheetFindManyArgs>(args?: SelectSubset<T, TimesheetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Timesheet.
     * @param {TimesheetCreateArgs} args - Arguments to create a Timesheet.
     * @example
     * // Create one Timesheet
     * const Timesheet = await prisma.timesheet.create({
     *   data: {
     *     // ... data to create a Timesheet
     *   }
     * })
     * 
     */
    create<T extends TimesheetCreateArgs>(args: SelectSubset<T, TimesheetCreateArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Timesheets.
     * @param {TimesheetCreateManyArgs} args - Arguments to create many Timesheets.
     * @example
     * // Create many Timesheets
     * const timesheet = await prisma.timesheet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TimesheetCreateManyArgs>(args?: SelectSubset<T, TimesheetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Timesheets and returns the data saved in the database.
     * @param {TimesheetCreateManyAndReturnArgs} args - Arguments to create many Timesheets.
     * @example
     * // Create many Timesheets
     * const timesheet = await prisma.timesheet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Timesheets and only return the `id`
     * const timesheetWithIdOnly = await prisma.timesheet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TimesheetCreateManyAndReturnArgs>(args?: SelectSubset<T, TimesheetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Timesheet.
     * @param {TimesheetDeleteArgs} args - Arguments to delete one Timesheet.
     * @example
     * // Delete one Timesheet
     * const Timesheet = await prisma.timesheet.delete({
     *   where: {
     *     // ... filter to delete one Timesheet
     *   }
     * })
     * 
     */
    delete<T extends TimesheetDeleteArgs>(args: SelectSubset<T, TimesheetDeleteArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Timesheet.
     * @param {TimesheetUpdateArgs} args - Arguments to update one Timesheet.
     * @example
     * // Update one Timesheet
     * const timesheet = await prisma.timesheet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TimesheetUpdateArgs>(args: SelectSubset<T, TimesheetUpdateArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Timesheets.
     * @param {TimesheetDeleteManyArgs} args - Arguments to filter Timesheets to delete.
     * @example
     * // Delete a few Timesheets
     * const { count } = await prisma.timesheet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TimesheetDeleteManyArgs>(args?: SelectSubset<T, TimesheetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Timesheets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Timesheets
     * const timesheet = await prisma.timesheet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TimesheetUpdateManyArgs>(args: SelectSubset<T, TimesheetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Timesheets and returns the data updated in the database.
     * @param {TimesheetUpdateManyAndReturnArgs} args - Arguments to update many Timesheets.
     * @example
     * // Update many Timesheets
     * const timesheet = await prisma.timesheet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Timesheets and only return the `id`
     * const timesheetWithIdOnly = await prisma.timesheet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TimesheetUpdateManyAndReturnArgs>(args: SelectSubset<T, TimesheetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Timesheet.
     * @param {TimesheetUpsertArgs} args - Arguments to update or create a Timesheet.
     * @example
     * // Update or create a Timesheet
     * const timesheet = await prisma.timesheet.upsert({
     *   create: {
     *     // ... data to create a Timesheet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Timesheet we want to update
     *   }
     * })
     */
    upsert<T extends TimesheetUpsertArgs>(args: SelectSubset<T, TimesheetUpsertArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Timesheets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetCountArgs} args - Arguments to filter Timesheets to count.
     * @example
     * // Count the number of Timesheets
     * const count = await prisma.timesheet.count({
     *   where: {
     *     // ... the filter for the Timesheets we want to count
     *   }
     * })
    **/
    count<T extends TimesheetCountArgs>(
      args?: Subset<T, TimesheetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TimesheetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Timesheet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TimesheetAggregateArgs>(args: Subset<T, TimesheetAggregateArgs>): Prisma.PrismaPromise<GetTimesheetAggregateType<T>>

    /**
     * Group by Timesheet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TimesheetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TimesheetGroupByArgs['orderBy'] }
        : { orderBy?: TimesheetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TimesheetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTimesheetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Timesheet model
   */
  readonly fields: TimesheetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Timesheet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TimesheetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    entries<T extends Timesheet$entriesArgs<ExtArgs> = {}>(args?: Subset<T, Timesheet$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Timesheet model
   */
  interface TimesheetFieldRefs {
    readonly id: FieldRef<"Timesheet", 'String'>
    readonly userId: FieldRef<"Timesheet", 'String'>
    readonly tenantId: FieldRef<"Timesheet", 'String'>
    readonly totalHours: FieldRef<"Timesheet", 'Float'>
    readonly status: FieldRef<"Timesheet", 'TimesheetStatus'>
    readonly createdAt: FieldRef<"Timesheet", 'DateTime'>
    readonly updatedAt: FieldRef<"Timesheet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Timesheet findUnique
   */
  export type TimesheetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * Filter, which Timesheet to fetch.
     */
    where: TimesheetWhereUniqueInput
  }

  /**
   * Timesheet findUniqueOrThrow
   */
  export type TimesheetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * Filter, which Timesheet to fetch.
     */
    where: TimesheetWhereUniqueInput
  }

  /**
   * Timesheet findFirst
   */
  export type TimesheetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * Filter, which Timesheet to fetch.
     */
    where?: TimesheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Timesheets to fetch.
     */
    orderBy?: TimesheetOrderByWithRelationInput | TimesheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Timesheets.
     */
    cursor?: TimesheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Timesheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Timesheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Timesheets.
     */
    distinct?: TimesheetScalarFieldEnum | TimesheetScalarFieldEnum[]
  }

  /**
   * Timesheet findFirstOrThrow
   */
  export type TimesheetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * Filter, which Timesheet to fetch.
     */
    where?: TimesheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Timesheets to fetch.
     */
    orderBy?: TimesheetOrderByWithRelationInput | TimesheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Timesheets.
     */
    cursor?: TimesheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Timesheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Timesheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Timesheets.
     */
    distinct?: TimesheetScalarFieldEnum | TimesheetScalarFieldEnum[]
  }

  /**
   * Timesheet findMany
   */
  export type TimesheetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * Filter, which Timesheets to fetch.
     */
    where?: TimesheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Timesheets to fetch.
     */
    orderBy?: TimesheetOrderByWithRelationInput | TimesheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Timesheets.
     */
    cursor?: TimesheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Timesheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Timesheets.
     */
    skip?: number
    distinct?: TimesheetScalarFieldEnum | TimesheetScalarFieldEnum[]
  }

  /**
   * Timesheet create
   */
  export type TimesheetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * The data needed to create a Timesheet.
     */
    data: XOR<TimesheetCreateInput, TimesheetUncheckedCreateInput>
  }

  /**
   * Timesheet createMany
   */
  export type TimesheetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Timesheets.
     */
    data: TimesheetCreateManyInput | TimesheetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Timesheet createManyAndReturn
   */
  export type TimesheetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * The data used to create many Timesheets.
     */
    data: TimesheetCreateManyInput | TimesheetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Timesheet update
   */
  export type TimesheetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * The data needed to update a Timesheet.
     */
    data: XOR<TimesheetUpdateInput, TimesheetUncheckedUpdateInput>
    /**
     * Choose, which Timesheet to update.
     */
    where: TimesheetWhereUniqueInput
  }

  /**
   * Timesheet updateMany
   */
  export type TimesheetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Timesheets.
     */
    data: XOR<TimesheetUpdateManyMutationInput, TimesheetUncheckedUpdateManyInput>
    /**
     * Filter which Timesheets to update
     */
    where?: TimesheetWhereInput
    /**
     * Limit how many Timesheets to update.
     */
    limit?: number
  }

  /**
   * Timesheet updateManyAndReturn
   */
  export type TimesheetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * The data used to update Timesheets.
     */
    data: XOR<TimesheetUpdateManyMutationInput, TimesheetUncheckedUpdateManyInput>
    /**
     * Filter which Timesheets to update
     */
    where?: TimesheetWhereInput
    /**
     * Limit how many Timesheets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Timesheet upsert
   */
  export type TimesheetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * The filter to search for the Timesheet to update in case it exists.
     */
    where: TimesheetWhereUniqueInput
    /**
     * In case the Timesheet found by the `where` argument doesn't exist, create a new Timesheet with this data.
     */
    create: XOR<TimesheetCreateInput, TimesheetUncheckedCreateInput>
    /**
     * In case the Timesheet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TimesheetUpdateInput, TimesheetUncheckedUpdateInput>
  }

  /**
   * Timesheet delete
   */
  export type TimesheetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
    /**
     * Filter which Timesheet to delete.
     */
    where: TimesheetWhereUniqueInput
  }

  /**
   * Timesheet deleteMany
   */
  export type TimesheetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Timesheets to delete
     */
    where?: TimesheetWhereInput
    /**
     * Limit how many Timesheets to delete.
     */
    limit?: number
  }

  /**
   * Timesheet.entries
   */
  export type Timesheet$entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    where?: TimesheetEntryWhereInput
    orderBy?: TimesheetEntryOrderByWithRelationInput | TimesheetEntryOrderByWithRelationInput[]
    cursor?: TimesheetEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TimesheetEntryScalarFieldEnum | TimesheetEntryScalarFieldEnum[]
  }

  /**
   * Timesheet without action
   */
  export type TimesheetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Timesheet
     */
    select?: TimesheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Timesheet
     */
    omit?: TimesheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetInclude<ExtArgs> | null
  }


  /**
   * Model TimesheetEntry
   */

  export type AggregateTimesheetEntry = {
    _count: TimesheetEntryCountAggregateOutputType | null
    _min: TimesheetEntryMinAggregateOutputType | null
    _max: TimesheetEntryMaxAggregateOutputType | null
  }

  export type TimesheetEntryMinAggregateOutputType = {
    id: string | null
    timesheetId: string | null
    action: $Enums.TimesheetEntryAction | null
    timestamp: Date | null
  }

  export type TimesheetEntryMaxAggregateOutputType = {
    id: string | null
    timesheetId: string | null
    action: $Enums.TimesheetEntryAction | null
    timestamp: Date | null
  }

  export type TimesheetEntryCountAggregateOutputType = {
    id: number
    timesheetId: number
    action: number
    timestamp: number
    _all: number
  }


  export type TimesheetEntryMinAggregateInputType = {
    id?: true
    timesheetId?: true
    action?: true
    timestamp?: true
  }

  export type TimesheetEntryMaxAggregateInputType = {
    id?: true
    timesheetId?: true
    action?: true
    timestamp?: true
  }

  export type TimesheetEntryCountAggregateInputType = {
    id?: true
    timesheetId?: true
    action?: true
    timestamp?: true
    _all?: true
  }

  export type TimesheetEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TimesheetEntry to aggregate.
     */
    where?: TimesheetEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimesheetEntries to fetch.
     */
    orderBy?: TimesheetEntryOrderByWithRelationInput | TimesheetEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TimesheetEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimesheetEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimesheetEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TimesheetEntries
    **/
    _count?: true | TimesheetEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TimesheetEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TimesheetEntryMaxAggregateInputType
  }

  export type GetTimesheetEntryAggregateType<T extends TimesheetEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateTimesheetEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTimesheetEntry[P]>
      : GetScalarType<T[P], AggregateTimesheetEntry[P]>
  }




  export type TimesheetEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimesheetEntryWhereInput
    orderBy?: TimesheetEntryOrderByWithAggregationInput | TimesheetEntryOrderByWithAggregationInput[]
    by: TimesheetEntryScalarFieldEnum[] | TimesheetEntryScalarFieldEnum
    having?: TimesheetEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TimesheetEntryCountAggregateInputType | true
    _min?: TimesheetEntryMinAggregateInputType
    _max?: TimesheetEntryMaxAggregateInputType
  }

  export type TimesheetEntryGroupByOutputType = {
    id: string
    timesheetId: string
    action: $Enums.TimesheetEntryAction
    timestamp: Date
    _count: TimesheetEntryCountAggregateOutputType | null
    _min: TimesheetEntryMinAggregateOutputType | null
    _max: TimesheetEntryMaxAggregateOutputType | null
  }

  type GetTimesheetEntryGroupByPayload<T extends TimesheetEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TimesheetEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TimesheetEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TimesheetEntryGroupByOutputType[P]>
            : GetScalarType<T[P], TimesheetEntryGroupByOutputType[P]>
        }
      >
    >


  export type TimesheetEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timesheetId?: boolean
    action?: boolean
    timestamp?: boolean
    timesheet?: boolean | TimesheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timesheetEntry"]>

  export type TimesheetEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timesheetId?: boolean
    action?: boolean
    timestamp?: boolean
    timesheet?: boolean | TimesheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timesheetEntry"]>

  export type TimesheetEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timesheetId?: boolean
    action?: boolean
    timestamp?: boolean
    timesheet?: boolean | TimesheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timesheetEntry"]>

  export type TimesheetEntrySelectScalar = {
    id?: boolean
    timesheetId?: boolean
    action?: boolean
    timestamp?: boolean
  }

  export type TimesheetEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timesheetId" | "action" | "timestamp", ExtArgs["result"]["timesheetEntry"]>
  export type TimesheetEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    timesheet?: boolean | TimesheetDefaultArgs<ExtArgs>
  }
  export type TimesheetEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    timesheet?: boolean | TimesheetDefaultArgs<ExtArgs>
  }
  export type TimesheetEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    timesheet?: boolean | TimesheetDefaultArgs<ExtArgs>
  }

  export type $TimesheetEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TimesheetEntry"
    objects: {
      timesheet: Prisma.$TimesheetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timesheetId: string
      action: $Enums.TimesheetEntryAction
      timestamp: Date
    }, ExtArgs["result"]["timesheetEntry"]>
    composites: {}
  }

  type TimesheetEntryGetPayload<S extends boolean | null | undefined | TimesheetEntryDefaultArgs> = $Result.GetResult<Prisma.$TimesheetEntryPayload, S>

  type TimesheetEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TimesheetEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TimesheetEntryCountAggregateInputType | true
    }

  export interface TimesheetEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TimesheetEntry'], meta: { name: 'TimesheetEntry' } }
    /**
     * Find zero or one TimesheetEntry that matches the filter.
     * @param {TimesheetEntryFindUniqueArgs} args - Arguments to find a TimesheetEntry
     * @example
     * // Get one TimesheetEntry
     * const timesheetEntry = await prisma.timesheetEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TimesheetEntryFindUniqueArgs>(args: SelectSubset<T, TimesheetEntryFindUniqueArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TimesheetEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TimesheetEntryFindUniqueOrThrowArgs} args - Arguments to find a TimesheetEntry
     * @example
     * // Get one TimesheetEntry
     * const timesheetEntry = await prisma.timesheetEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TimesheetEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, TimesheetEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TimesheetEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetEntryFindFirstArgs} args - Arguments to find a TimesheetEntry
     * @example
     * // Get one TimesheetEntry
     * const timesheetEntry = await prisma.timesheetEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TimesheetEntryFindFirstArgs>(args?: SelectSubset<T, TimesheetEntryFindFirstArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TimesheetEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetEntryFindFirstOrThrowArgs} args - Arguments to find a TimesheetEntry
     * @example
     * // Get one TimesheetEntry
     * const timesheetEntry = await prisma.timesheetEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TimesheetEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, TimesheetEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TimesheetEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TimesheetEntries
     * const timesheetEntries = await prisma.timesheetEntry.findMany()
     * 
     * // Get first 10 TimesheetEntries
     * const timesheetEntries = await prisma.timesheetEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const timesheetEntryWithIdOnly = await prisma.timesheetEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TimesheetEntryFindManyArgs>(args?: SelectSubset<T, TimesheetEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TimesheetEntry.
     * @param {TimesheetEntryCreateArgs} args - Arguments to create a TimesheetEntry.
     * @example
     * // Create one TimesheetEntry
     * const TimesheetEntry = await prisma.timesheetEntry.create({
     *   data: {
     *     // ... data to create a TimesheetEntry
     *   }
     * })
     * 
     */
    create<T extends TimesheetEntryCreateArgs>(args: SelectSubset<T, TimesheetEntryCreateArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TimesheetEntries.
     * @param {TimesheetEntryCreateManyArgs} args - Arguments to create many TimesheetEntries.
     * @example
     * // Create many TimesheetEntries
     * const timesheetEntry = await prisma.timesheetEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TimesheetEntryCreateManyArgs>(args?: SelectSubset<T, TimesheetEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TimesheetEntries and returns the data saved in the database.
     * @param {TimesheetEntryCreateManyAndReturnArgs} args - Arguments to create many TimesheetEntries.
     * @example
     * // Create many TimesheetEntries
     * const timesheetEntry = await prisma.timesheetEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TimesheetEntries and only return the `id`
     * const timesheetEntryWithIdOnly = await prisma.timesheetEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TimesheetEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, TimesheetEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TimesheetEntry.
     * @param {TimesheetEntryDeleteArgs} args - Arguments to delete one TimesheetEntry.
     * @example
     * // Delete one TimesheetEntry
     * const TimesheetEntry = await prisma.timesheetEntry.delete({
     *   where: {
     *     // ... filter to delete one TimesheetEntry
     *   }
     * })
     * 
     */
    delete<T extends TimesheetEntryDeleteArgs>(args: SelectSubset<T, TimesheetEntryDeleteArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TimesheetEntry.
     * @param {TimesheetEntryUpdateArgs} args - Arguments to update one TimesheetEntry.
     * @example
     * // Update one TimesheetEntry
     * const timesheetEntry = await prisma.timesheetEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TimesheetEntryUpdateArgs>(args: SelectSubset<T, TimesheetEntryUpdateArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TimesheetEntries.
     * @param {TimesheetEntryDeleteManyArgs} args - Arguments to filter TimesheetEntries to delete.
     * @example
     * // Delete a few TimesheetEntries
     * const { count } = await prisma.timesheetEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TimesheetEntryDeleteManyArgs>(args?: SelectSubset<T, TimesheetEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TimesheetEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TimesheetEntries
     * const timesheetEntry = await prisma.timesheetEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TimesheetEntryUpdateManyArgs>(args: SelectSubset<T, TimesheetEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TimesheetEntries and returns the data updated in the database.
     * @param {TimesheetEntryUpdateManyAndReturnArgs} args - Arguments to update many TimesheetEntries.
     * @example
     * // Update many TimesheetEntries
     * const timesheetEntry = await prisma.timesheetEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TimesheetEntries and only return the `id`
     * const timesheetEntryWithIdOnly = await prisma.timesheetEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TimesheetEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, TimesheetEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TimesheetEntry.
     * @param {TimesheetEntryUpsertArgs} args - Arguments to update or create a TimesheetEntry.
     * @example
     * // Update or create a TimesheetEntry
     * const timesheetEntry = await prisma.timesheetEntry.upsert({
     *   create: {
     *     // ... data to create a TimesheetEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TimesheetEntry we want to update
     *   }
     * })
     */
    upsert<T extends TimesheetEntryUpsertArgs>(args: SelectSubset<T, TimesheetEntryUpsertArgs<ExtArgs>>): Prisma__TimesheetEntryClient<$Result.GetResult<Prisma.$TimesheetEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TimesheetEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetEntryCountArgs} args - Arguments to filter TimesheetEntries to count.
     * @example
     * // Count the number of TimesheetEntries
     * const count = await prisma.timesheetEntry.count({
     *   where: {
     *     // ... the filter for the TimesheetEntries we want to count
     *   }
     * })
    **/
    count<T extends TimesheetEntryCountArgs>(
      args?: Subset<T, TimesheetEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TimesheetEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TimesheetEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TimesheetEntryAggregateArgs>(args: Subset<T, TimesheetEntryAggregateArgs>): Prisma.PrismaPromise<GetTimesheetEntryAggregateType<T>>

    /**
     * Group by TimesheetEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimesheetEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TimesheetEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TimesheetEntryGroupByArgs['orderBy'] }
        : { orderBy?: TimesheetEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TimesheetEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTimesheetEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TimesheetEntry model
   */
  readonly fields: TimesheetEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TimesheetEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TimesheetEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    timesheet<T extends TimesheetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TimesheetDefaultArgs<ExtArgs>>): Prisma__TimesheetClient<$Result.GetResult<Prisma.$TimesheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TimesheetEntry model
   */
  interface TimesheetEntryFieldRefs {
    readonly id: FieldRef<"TimesheetEntry", 'String'>
    readonly timesheetId: FieldRef<"TimesheetEntry", 'String'>
    readonly action: FieldRef<"TimesheetEntry", 'TimesheetEntryAction'>
    readonly timestamp: FieldRef<"TimesheetEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TimesheetEntry findUnique
   */
  export type TimesheetEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * Filter, which TimesheetEntry to fetch.
     */
    where: TimesheetEntryWhereUniqueInput
  }

  /**
   * TimesheetEntry findUniqueOrThrow
   */
  export type TimesheetEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * Filter, which TimesheetEntry to fetch.
     */
    where: TimesheetEntryWhereUniqueInput
  }

  /**
   * TimesheetEntry findFirst
   */
  export type TimesheetEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * Filter, which TimesheetEntry to fetch.
     */
    where?: TimesheetEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimesheetEntries to fetch.
     */
    orderBy?: TimesheetEntryOrderByWithRelationInput | TimesheetEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TimesheetEntries.
     */
    cursor?: TimesheetEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimesheetEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimesheetEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TimesheetEntries.
     */
    distinct?: TimesheetEntryScalarFieldEnum | TimesheetEntryScalarFieldEnum[]
  }

  /**
   * TimesheetEntry findFirstOrThrow
   */
  export type TimesheetEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * Filter, which TimesheetEntry to fetch.
     */
    where?: TimesheetEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimesheetEntries to fetch.
     */
    orderBy?: TimesheetEntryOrderByWithRelationInput | TimesheetEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TimesheetEntries.
     */
    cursor?: TimesheetEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimesheetEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimesheetEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TimesheetEntries.
     */
    distinct?: TimesheetEntryScalarFieldEnum | TimesheetEntryScalarFieldEnum[]
  }

  /**
   * TimesheetEntry findMany
   */
  export type TimesheetEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * Filter, which TimesheetEntries to fetch.
     */
    where?: TimesheetEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimesheetEntries to fetch.
     */
    orderBy?: TimesheetEntryOrderByWithRelationInput | TimesheetEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TimesheetEntries.
     */
    cursor?: TimesheetEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimesheetEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimesheetEntries.
     */
    skip?: number
    distinct?: TimesheetEntryScalarFieldEnum | TimesheetEntryScalarFieldEnum[]
  }

  /**
   * TimesheetEntry create
   */
  export type TimesheetEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a TimesheetEntry.
     */
    data: XOR<TimesheetEntryCreateInput, TimesheetEntryUncheckedCreateInput>
  }

  /**
   * TimesheetEntry createMany
   */
  export type TimesheetEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TimesheetEntries.
     */
    data: TimesheetEntryCreateManyInput | TimesheetEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TimesheetEntry createManyAndReturn
   */
  export type TimesheetEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * The data used to create many TimesheetEntries.
     */
    data: TimesheetEntryCreateManyInput | TimesheetEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TimesheetEntry update
   */
  export type TimesheetEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a TimesheetEntry.
     */
    data: XOR<TimesheetEntryUpdateInput, TimesheetEntryUncheckedUpdateInput>
    /**
     * Choose, which TimesheetEntry to update.
     */
    where: TimesheetEntryWhereUniqueInput
  }

  /**
   * TimesheetEntry updateMany
   */
  export type TimesheetEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TimesheetEntries.
     */
    data: XOR<TimesheetEntryUpdateManyMutationInput, TimesheetEntryUncheckedUpdateManyInput>
    /**
     * Filter which TimesheetEntries to update
     */
    where?: TimesheetEntryWhereInput
    /**
     * Limit how many TimesheetEntries to update.
     */
    limit?: number
  }

  /**
   * TimesheetEntry updateManyAndReturn
   */
  export type TimesheetEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * The data used to update TimesheetEntries.
     */
    data: XOR<TimesheetEntryUpdateManyMutationInput, TimesheetEntryUncheckedUpdateManyInput>
    /**
     * Filter which TimesheetEntries to update
     */
    where?: TimesheetEntryWhereInput
    /**
     * Limit how many TimesheetEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TimesheetEntry upsert
   */
  export type TimesheetEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the TimesheetEntry to update in case it exists.
     */
    where: TimesheetEntryWhereUniqueInput
    /**
     * In case the TimesheetEntry found by the `where` argument doesn't exist, create a new TimesheetEntry with this data.
     */
    create: XOR<TimesheetEntryCreateInput, TimesheetEntryUncheckedCreateInput>
    /**
     * In case the TimesheetEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TimesheetEntryUpdateInput, TimesheetEntryUncheckedUpdateInput>
  }

  /**
   * TimesheetEntry delete
   */
  export type TimesheetEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
    /**
     * Filter which TimesheetEntry to delete.
     */
    where: TimesheetEntryWhereUniqueInput
  }

  /**
   * TimesheetEntry deleteMany
   */
  export type TimesheetEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TimesheetEntries to delete
     */
    where?: TimesheetEntryWhereInput
    /**
     * Limit how many TimesheetEntries to delete.
     */
    limit?: number
  }

  /**
   * TimesheetEntry without action
   */
  export type TimesheetEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimesheetEntry
     */
    select?: TimesheetEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TimesheetEntry
     */
    omit?: TimesheetEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimesheetEntryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    name: 'name',
    password: 'password',
    role: 'role',
    birthday: 'birthday',
    contact: 'contact',
    address: 'address',
    sss: 'sss',
    tin: 'tin',
    philhealth: 'philhealth',
    pagibig: 'pagibig',
    shouldChangePassword: 'shouldChangePassword',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    contact: 'contact',
    address: 'address',
    description: 'description',
    sss: 'sss',
    tin: 'tin',
    philhealth: 'philhealth',
    pagibig: 'pagibig',
    logoUrl: 'logoUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const TenantsOnUsersScalarFieldEnum: {
    userId: 'userId',
    tenantId: 'tenantId'
  };

  export type TenantsOnUsersScalarFieldEnum = (typeof TenantsOnUsersScalarFieldEnum)[keyof typeof TenantsOnUsersScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    refreshTokenHash: 'refreshTokenHash',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    url: 'url',
    uploadedAt: 'uploadedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const TimesheetScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tenantId: 'tenantId',
    totalHours: 'totalHours',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TimesheetScalarFieldEnum = (typeof TimesheetScalarFieldEnum)[keyof typeof TimesheetScalarFieldEnum]


  export const TimesheetEntryScalarFieldEnum: {
    id: 'id',
    timesheetId: 'timesheetId',
    action: 'action',
    timestamp: 'timestamp'
  };

  export type TimesheetEntryScalarFieldEnum = (typeof TimesheetEntryScalarFieldEnum)[keyof typeof TimesheetEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'TimesheetStatus'
   */
  export type EnumTimesheetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TimesheetStatus'>
    


  /**
   * Reference to a field of type 'TimesheetStatus[]'
   */
  export type ListEnumTimesheetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TimesheetStatus[]'>
    


  /**
   * Reference to a field of type 'TimesheetEntryAction'
   */
  export type EnumTimesheetEntryActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TimesheetEntryAction'>
    


  /**
   * Reference to a field of type 'TimesheetEntryAction[]'
   */
  export type ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TimesheetEntryAction[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    birthday?: DateTimeNullableFilter<"User"> | Date | string | null
    contact?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    sss?: StringNullableFilter<"User"> | string | null
    tin?: StringNullableFilter<"User"> | string | null
    philhealth?: StringNullableFilter<"User"> | string | null
    pagibig?: StringNullableFilter<"User"> | string | null
    shouldChangePassword?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    timesheets?: TimesheetListRelationFilter
    tenants?: TenantsOnUsersListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    birthday?: SortOrderInput | SortOrder
    contact?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    sss?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    philhealth?: SortOrderInput | SortOrder
    pagibig?: SortOrderInput | SortOrder
    shouldChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    timesheets?: TimesheetOrderByRelationAggregateInput
    tenants?: TenantsOnUsersOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    birthday?: DateTimeNullableFilter<"User"> | Date | string | null
    contact?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    sss?: StringNullableFilter<"User"> | string | null
    tin?: StringNullableFilter<"User"> | string | null
    philhealth?: StringNullableFilter<"User"> | string | null
    pagibig?: StringNullableFilter<"User"> | string | null
    shouldChangePassword?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    timesheets?: TimesheetListRelationFilter
    tenants?: TenantsOnUsersListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    birthday?: SortOrderInput | SortOrder
    contact?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    sss?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    philhealth?: SortOrderInput | SortOrder
    pagibig?: SortOrderInput | SortOrder
    shouldChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    birthday?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    contact?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    sss?: StringNullableWithAggregatesFilter<"User"> | string | null
    tin?: StringNullableWithAggregatesFilter<"User"> | string | null
    philhealth?: StringNullableWithAggregatesFilter<"User"> | string | null
    pagibig?: StringNullableWithAggregatesFilter<"User"> | string | null
    shouldChangePassword?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    email?: StringFilter<"Tenant"> | string
    contact?: StringFilter<"Tenant"> | string
    address?: StringNullableFilter<"Tenant"> | string | null
    description?: StringNullableFilter<"Tenant"> | string | null
    sss?: StringNullableFilter<"Tenant"> | string | null
    tin?: StringNullableFilter<"Tenant"> | string | null
    philhealth?: StringNullableFilter<"Tenant"> | string | null
    pagibig?: StringNullableFilter<"Tenant"> | string | null
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    documents?: DocumentListRelationFilter
    users?: TenantsOnUsersListRelationFilter
    timesheets?: TimesheetListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    address?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    sss?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    philhealth?: SortOrderInput | SortOrder
    pagibig?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    documents?: DocumentOrderByRelationAggregateInput
    users?: TenantsOnUsersOrderByRelationAggregateInput
    timesheets?: TimesheetOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    email?: StringFilter<"Tenant"> | string
    contact?: StringFilter<"Tenant"> | string
    address?: StringNullableFilter<"Tenant"> | string | null
    description?: StringNullableFilter<"Tenant"> | string | null
    sss?: StringNullableFilter<"Tenant"> | string | null
    tin?: StringNullableFilter<"Tenant"> | string | null
    philhealth?: StringNullableFilter<"Tenant"> | string | null
    pagibig?: StringNullableFilter<"Tenant"> | string | null
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    documents?: DocumentListRelationFilter
    users?: TenantsOnUsersListRelationFilter
    timesheets?: TimesheetListRelationFilter
  }, "id">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    address?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    sss?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    philhealth?: SortOrderInput | SortOrder
    pagibig?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    email?: StringWithAggregatesFilter<"Tenant"> | string
    contact?: StringWithAggregatesFilter<"Tenant"> | string
    address?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    description?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    sss?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    tin?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    philhealth?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    pagibig?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    logoUrl?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type TenantsOnUsersWhereInput = {
    AND?: TenantsOnUsersWhereInput | TenantsOnUsersWhereInput[]
    OR?: TenantsOnUsersWhereInput[]
    NOT?: TenantsOnUsersWhereInput | TenantsOnUsersWhereInput[]
    userId?: StringFilter<"TenantsOnUsers"> | string
    tenantId?: StringFilter<"TenantsOnUsers"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type TenantsOnUsersOrderByWithRelationInput = {
    userId?: SortOrder
    tenantId?: SortOrder
    user?: UserOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantsOnUsersWhereUniqueInput = Prisma.AtLeast<{
    userId_tenantId?: TenantsOnUsersUserIdTenantIdCompoundUniqueInput
    AND?: TenantsOnUsersWhereInput | TenantsOnUsersWhereInput[]
    OR?: TenantsOnUsersWhereInput[]
    NOT?: TenantsOnUsersWhereInput | TenantsOnUsersWhereInput[]
    userId?: StringFilter<"TenantsOnUsers"> | string
    tenantId?: StringFilter<"TenantsOnUsers"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "userId_tenantId">

  export type TenantsOnUsersOrderByWithAggregationInput = {
    userId?: SortOrder
    tenantId?: SortOrder
    _count?: TenantsOnUsersCountOrderByAggregateInput
    _max?: TenantsOnUsersMaxOrderByAggregateInput
    _min?: TenantsOnUsersMinOrderByAggregateInput
  }

  export type TenantsOnUsersScalarWhereWithAggregatesInput = {
    AND?: TenantsOnUsersScalarWhereWithAggregatesInput | TenantsOnUsersScalarWhereWithAggregatesInput[]
    OR?: TenantsOnUsersScalarWhereWithAggregatesInput[]
    NOT?: TenantsOnUsersScalarWhereWithAggregatesInput | TenantsOnUsersScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"TenantsOnUsers"> | string
    tenantId?: StringWithAggregatesFilter<"TenantsOnUsers"> | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    refreshTokenHash?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    refreshTokenHash?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    refreshTokenHash?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    tenantId?: StringFilter<"Document"> | string
    name?: StringFilter<"Document"> | string
    url?: StringFilter<"Document"> | string
    uploadedAt?: DateTimeFilter<"Document"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    uploadedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    tenantId?: StringFilter<"Document"> | string
    name?: StringFilter<"Document"> | string
    url?: StringFilter<"Document"> | string
    uploadedAt?: DateTimeFilter<"Document"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    uploadedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    tenantId?: StringWithAggregatesFilter<"Document"> | string
    name?: StringWithAggregatesFilter<"Document"> | string
    url?: StringWithAggregatesFilter<"Document"> | string
    uploadedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type TimesheetWhereInput = {
    AND?: TimesheetWhereInput | TimesheetWhereInput[]
    OR?: TimesheetWhereInput[]
    NOT?: TimesheetWhereInput | TimesheetWhereInput[]
    id?: StringFilter<"Timesheet"> | string
    userId?: StringFilter<"Timesheet"> | string
    tenantId?: StringFilter<"Timesheet"> | string
    totalHours?: FloatFilter<"Timesheet"> | number
    status?: EnumTimesheetStatusFilter<"Timesheet"> | $Enums.TimesheetStatus
    createdAt?: DateTimeFilter<"Timesheet"> | Date | string
    updatedAt?: DateTimeFilter<"Timesheet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    entries?: TimesheetEntryListRelationFilter
  }

  export type TimesheetOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tenantId?: SortOrder
    totalHours?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
    entries?: TimesheetEntryOrderByRelationAggregateInput
  }

  export type TimesheetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TimesheetWhereInput | TimesheetWhereInput[]
    OR?: TimesheetWhereInput[]
    NOT?: TimesheetWhereInput | TimesheetWhereInput[]
    userId?: StringFilter<"Timesheet"> | string
    tenantId?: StringFilter<"Timesheet"> | string
    totalHours?: FloatFilter<"Timesheet"> | number
    status?: EnumTimesheetStatusFilter<"Timesheet"> | $Enums.TimesheetStatus
    createdAt?: DateTimeFilter<"Timesheet"> | Date | string
    updatedAt?: DateTimeFilter<"Timesheet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    entries?: TimesheetEntryListRelationFilter
  }, "id">

  export type TimesheetOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tenantId?: SortOrder
    totalHours?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TimesheetCountOrderByAggregateInput
    _avg?: TimesheetAvgOrderByAggregateInput
    _max?: TimesheetMaxOrderByAggregateInput
    _min?: TimesheetMinOrderByAggregateInput
    _sum?: TimesheetSumOrderByAggregateInput
  }

  export type TimesheetScalarWhereWithAggregatesInput = {
    AND?: TimesheetScalarWhereWithAggregatesInput | TimesheetScalarWhereWithAggregatesInput[]
    OR?: TimesheetScalarWhereWithAggregatesInput[]
    NOT?: TimesheetScalarWhereWithAggregatesInput | TimesheetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Timesheet"> | string
    userId?: StringWithAggregatesFilter<"Timesheet"> | string
    tenantId?: StringWithAggregatesFilter<"Timesheet"> | string
    totalHours?: FloatWithAggregatesFilter<"Timesheet"> | number
    status?: EnumTimesheetStatusWithAggregatesFilter<"Timesheet"> | $Enums.TimesheetStatus
    createdAt?: DateTimeWithAggregatesFilter<"Timesheet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Timesheet"> | Date | string
  }

  export type TimesheetEntryWhereInput = {
    AND?: TimesheetEntryWhereInput | TimesheetEntryWhereInput[]
    OR?: TimesheetEntryWhereInput[]
    NOT?: TimesheetEntryWhereInput | TimesheetEntryWhereInput[]
    id?: StringFilter<"TimesheetEntry"> | string
    timesheetId?: StringFilter<"TimesheetEntry"> | string
    action?: EnumTimesheetEntryActionFilter<"TimesheetEntry"> | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFilter<"TimesheetEntry"> | Date | string
    timesheet?: XOR<TimesheetScalarRelationFilter, TimesheetWhereInput>
  }

  export type TimesheetEntryOrderByWithRelationInput = {
    id?: SortOrder
    timesheetId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    timesheet?: TimesheetOrderByWithRelationInput
  }

  export type TimesheetEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TimesheetEntryWhereInput | TimesheetEntryWhereInput[]
    OR?: TimesheetEntryWhereInput[]
    NOT?: TimesheetEntryWhereInput | TimesheetEntryWhereInput[]
    timesheetId?: StringFilter<"TimesheetEntry"> | string
    action?: EnumTimesheetEntryActionFilter<"TimesheetEntry"> | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFilter<"TimesheetEntry"> | Date | string
    timesheet?: XOR<TimesheetScalarRelationFilter, TimesheetWhereInput>
  }, "id">

  export type TimesheetEntryOrderByWithAggregationInput = {
    id?: SortOrder
    timesheetId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    _count?: TimesheetEntryCountOrderByAggregateInput
    _max?: TimesheetEntryMaxOrderByAggregateInput
    _min?: TimesheetEntryMinOrderByAggregateInput
  }

  export type TimesheetEntryScalarWhereWithAggregatesInput = {
    AND?: TimesheetEntryScalarWhereWithAggregatesInput | TimesheetEntryScalarWhereWithAggregatesInput[]
    OR?: TimesheetEntryScalarWhereWithAggregatesInput[]
    NOT?: TimesheetEntryScalarWhereWithAggregatesInput | TimesheetEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TimesheetEntry"> | string
    timesheetId?: StringWithAggregatesFilter<"TimesheetEntry"> | string
    action?: EnumTimesheetEntryActionWithAggregatesFilter<"TimesheetEntry"> | $Enums.TimesheetEntryAction
    timestamp?: DateTimeWithAggregatesFilter<"TimesheetEntry"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    timesheets?: TimesheetCreateNestedManyWithoutUserInput
    tenants?: TenantsOnUsersCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    timesheets?: TimesheetUncheckedCreateNestedManyWithoutUserInput
    tenants?: TenantsOnUsersUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    timesheets?: TimesheetUpdateManyWithoutUserNestedInput
    tenants?: TenantsOnUsersUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    timesheets?: TimesheetUncheckedUpdateManyWithoutUserNestedInput
    tenants?: TenantsOnUsersUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutTenantInput
    users?: TenantsOnUsersCreateNestedManyWithoutTenantInput
    timesheets?: TimesheetCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutTenantInput
    users?: TenantsOnUsersUncheckedCreateNestedManyWithoutTenantInput
    timesheets?: TimesheetUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutTenantNestedInput
    users?: TenantsOnUsersUpdateManyWithoutTenantNestedInput
    timesheets?: TimesheetUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutTenantNestedInput
    users?: TenantsOnUsersUncheckedUpdateManyWithoutTenantNestedInput
    timesheets?: TimesheetUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantsOnUsersCreateInput = {
    user: UserCreateNestedOneWithoutTenantsInput
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type TenantsOnUsersUncheckedCreateInput = {
    userId: string
    tenantId: string
  }

  export type TenantsOnUsersUpdateInput = {
    user?: UserUpdateOneRequiredWithoutTenantsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type TenantsOnUsersUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantsOnUsersCreateManyInput = {
    userId: string
    tenantId: string
  }

  export type TenantsOnUsersUpdateManyMutationInput = {

  }

  export type TenantsOnUsersUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateInput = {
    id?: string
    refreshTokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    userId: string
    refreshTokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    refreshTokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    name: string
    url: string
    uploadedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    tenantId: string
    name: string
    url: string
    uploadedAt?: Date | string
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyInput = {
    id?: string
    tenantId: string
    name: string
    url: string
    uploadedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetCreateInput = {
    id?: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTimesheetsInput
    tenant: TenantCreateNestedOneWithoutTimesheetsInput
    entries?: TimesheetEntryCreateNestedManyWithoutTimesheetInput
  }

  export type TimesheetUncheckedCreateInput = {
    id?: string
    userId: string
    tenantId: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: TimesheetEntryUncheckedCreateNestedManyWithoutTimesheetInput
  }

  export type TimesheetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTimesheetsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutTimesheetsNestedInput
    entries?: TimesheetEntryUpdateManyWithoutTimesheetNestedInput
  }

  export type TimesheetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: TimesheetEntryUncheckedUpdateManyWithoutTimesheetNestedInput
  }

  export type TimesheetCreateManyInput = {
    id?: string
    userId: string
    tenantId: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimesheetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetEntryCreateInput = {
    id?: string
    action: $Enums.TimesheetEntryAction
    timestamp?: Date | string
    timesheet: TimesheetCreateNestedOneWithoutEntriesInput
  }

  export type TimesheetEntryUncheckedCreateInput = {
    id?: string
    timesheetId: string
    action: $Enums.TimesheetEntryAction
    timestamp?: Date | string
  }

  export type TimesheetEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumTimesheetEntryActionFieldUpdateOperationsInput | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    timesheet?: TimesheetUpdateOneRequiredWithoutEntriesNestedInput
  }

  export type TimesheetEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timesheetId?: StringFieldUpdateOperationsInput | string
    action?: EnumTimesheetEntryActionFieldUpdateOperationsInput | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetEntryCreateManyInput = {
    id?: string
    timesheetId: string
    action: $Enums.TimesheetEntryAction
    timestamp?: Date | string
  }

  export type TimesheetEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumTimesheetEntryActionFieldUpdateOperationsInput | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timesheetId?: StringFieldUpdateOperationsInput | string
    action?: EnumTimesheetEntryActionFieldUpdateOperationsInput | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type TimesheetListRelationFilter = {
    every?: TimesheetWhereInput
    some?: TimesheetWhereInput
    none?: TimesheetWhereInput
  }

  export type TenantsOnUsersListRelationFilter = {
    every?: TenantsOnUsersWhereInput
    some?: TenantsOnUsersWhereInput
    none?: TenantsOnUsersWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TimesheetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantsOnUsersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    birthday?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    sss?: SortOrder
    tin?: SortOrder
    philhealth?: SortOrder
    pagibig?: SortOrder
    shouldChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    birthday?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    sss?: SortOrder
    tin?: SortOrder
    philhealth?: SortOrder
    pagibig?: SortOrder
    shouldChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    birthday?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    sss?: SortOrder
    tin?: SortOrder
    philhealth?: SortOrder
    pagibig?: SortOrder
    shouldChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    description?: SortOrder
    sss?: SortOrder
    tin?: SortOrder
    philhealth?: SortOrder
    pagibig?: SortOrder
    logoUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    description?: SortOrder
    sss?: SortOrder
    tin?: SortOrder
    philhealth?: SortOrder
    pagibig?: SortOrder
    logoUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    description?: SortOrder
    sss?: SortOrder
    tin?: SortOrder
    philhealth?: SortOrder
    pagibig?: SortOrder
    logoUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type TenantsOnUsersUserIdTenantIdCompoundUniqueInput = {
    userId: string
    tenantId: string
  }

  export type TenantsOnUsersCountOrderByAggregateInput = {
    userId?: SortOrder
    tenantId?: SortOrder
  }

  export type TenantsOnUsersMaxOrderByAggregateInput = {
    userId?: SortOrder
    tenantId?: SortOrder
  }

  export type TenantsOnUsersMinOrderByAggregateInput = {
    userId?: SortOrder
    tenantId?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    uploadedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumTimesheetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetStatus | EnumTimesheetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetStatusFilter<$PrismaModel> | $Enums.TimesheetStatus
  }

  export type TimesheetEntryListRelationFilter = {
    every?: TimesheetEntryWhereInput
    some?: TimesheetEntryWhereInput
    none?: TimesheetEntryWhereInput
  }

  export type TimesheetEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TimesheetCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tenantId?: SortOrder
    totalHours?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimesheetAvgOrderByAggregateInput = {
    totalHours?: SortOrder
  }

  export type TimesheetMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tenantId?: SortOrder
    totalHours?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimesheetMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tenantId?: SortOrder
    totalHours?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimesheetSumOrderByAggregateInput = {
    totalHours?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumTimesheetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetStatus | EnumTimesheetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetStatusWithAggregatesFilter<$PrismaModel> | $Enums.TimesheetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTimesheetStatusFilter<$PrismaModel>
    _max?: NestedEnumTimesheetStatusFilter<$PrismaModel>
  }

  export type EnumTimesheetEntryActionFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetEntryAction | EnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetEntryActionFilter<$PrismaModel> | $Enums.TimesheetEntryAction
  }

  export type TimesheetScalarRelationFilter = {
    is?: TimesheetWhereInput
    isNot?: TimesheetWhereInput
  }

  export type TimesheetEntryCountOrderByAggregateInput = {
    id?: SortOrder
    timesheetId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
  }

  export type TimesheetEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    timesheetId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
  }

  export type TimesheetEntryMinOrderByAggregateInput = {
    id?: SortOrder
    timesheetId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
  }

  export type EnumTimesheetEntryActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetEntryAction | EnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetEntryActionWithAggregatesFilter<$PrismaModel> | $Enums.TimesheetEntryAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTimesheetEntryActionFilter<$PrismaModel>
    _max?: NestedEnumTimesheetEntryActionFilter<$PrismaModel>
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type TimesheetCreateNestedManyWithoutUserInput = {
    create?: XOR<TimesheetCreateWithoutUserInput, TimesheetUncheckedCreateWithoutUserInput> | TimesheetCreateWithoutUserInput[] | TimesheetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutUserInput | TimesheetCreateOrConnectWithoutUserInput[]
    createMany?: TimesheetCreateManyUserInputEnvelope
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
  }

  export type TenantsOnUsersCreateNestedManyWithoutUserInput = {
    create?: XOR<TenantsOnUsersCreateWithoutUserInput, TenantsOnUsersUncheckedCreateWithoutUserInput> | TenantsOnUsersCreateWithoutUserInput[] | TenantsOnUsersUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutUserInput | TenantsOnUsersCreateOrConnectWithoutUserInput[]
    createMany?: TenantsOnUsersCreateManyUserInputEnvelope
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type TimesheetUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TimesheetCreateWithoutUserInput, TimesheetUncheckedCreateWithoutUserInput> | TimesheetCreateWithoutUserInput[] | TimesheetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutUserInput | TimesheetCreateOrConnectWithoutUserInput[]
    createMany?: TimesheetCreateManyUserInputEnvelope
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
  }

  export type TenantsOnUsersUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TenantsOnUsersCreateWithoutUserInput, TenantsOnUsersUncheckedCreateWithoutUserInput> | TenantsOnUsersCreateWithoutUserInput[] | TenantsOnUsersUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutUserInput | TenantsOnUsersCreateOrConnectWithoutUserInput[]
    createMany?: TenantsOnUsersCreateManyUserInputEnvelope
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type TimesheetUpdateManyWithoutUserNestedInput = {
    create?: XOR<TimesheetCreateWithoutUserInput, TimesheetUncheckedCreateWithoutUserInput> | TimesheetCreateWithoutUserInput[] | TimesheetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutUserInput | TimesheetCreateOrConnectWithoutUserInput[]
    upsert?: TimesheetUpsertWithWhereUniqueWithoutUserInput | TimesheetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TimesheetCreateManyUserInputEnvelope
    set?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    disconnect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    delete?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    update?: TimesheetUpdateWithWhereUniqueWithoutUserInput | TimesheetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TimesheetUpdateManyWithWhereWithoutUserInput | TimesheetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TimesheetScalarWhereInput | TimesheetScalarWhereInput[]
  }

  export type TenantsOnUsersUpdateManyWithoutUserNestedInput = {
    create?: XOR<TenantsOnUsersCreateWithoutUserInput, TenantsOnUsersUncheckedCreateWithoutUserInput> | TenantsOnUsersCreateWithoutUserInput[] | TenantsOnUsersUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutUserInput | TenantsOnUsersCreateOrConnectWithoutUserInput[]
    upsert?: TenantsOnUsersUpsertWithWhereUniqueWithoutUserInput | TenantsOnUsersUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TenantsOnUsersCreateManyUserInputEnvelope
    set?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    disconnect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    delete?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    update?: TenantsOnUsersUpdateWithWhereUniqueWithoutUserInput | TenantsOnUsersUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TenantsOnUsersUpdateManyWithWhereWithoutUserInput | TenantsOnUsersUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TenantsOnUsersScalarWhereInput | TenantsOnUsersScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type TimesheetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TimesheetCreateWithoutUserInput, TimesheetUncheckedCreateWithoutUserInput> | TimesheetCreateWithoutUserInput[] | TimesheetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutUserInput | TimesheetCreateOrConnectWithoutUserInput[]
    upsert?: TimesheetUpsertWithWhereUniqueWithoutUserInput | TimesheetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TimesheetCreateManyUserInputEnvelope
    set?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    disconnect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    delete?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    update?: TimesheetUpdateWithWhereUniqueWithoutUserInput | TimesheetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TimesheetUpdateManyWithWhereWithoutUserInput | TimesheetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TimesheetScalarWhereInput | TimesheetScalarWhereInput[]
  }

  export type TenantsOnUsersUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TenantsOnUsersCreateWithoutUserInput, TenantsOnUsersUncheckedCreateWithoutUserInput> | TenantsOnUsersCreateWithoutUserInput[] | TenantsOnUsersUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutUserInput | TenantsOnUsersCreateOrConnectWithoutUserInput[]
    upsert?: TenantsOnUsersUpsertWithWhereUniqueWithoutUserInput | TenantsOnUsersUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TenantsOnUsersCreateManyUserInputEnvelope
    set?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    disconnect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    delete?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    update?: TenantsOnUsersUpdateWithWhereUniqueWithoutUserInput | TenantsOnUsersUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TenantsOnUsersUpdateManyWithWhereWithoutUserInput | TenantsOnUsersUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TenantsOnUsersScalarWhereInput | TenantsOnUsersScalarWhereInput[]
  }

  export type DocumentCreateNestedManyWithoutTenantInput = {
    create?: XOR<DocumentCreateWithoutTenantInput, DocumentUncheckedCreateWithoutTenantInput> | DocumentCreateWithoutTenantInput[] | DocumentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutTenantInput | DocumentCreateOrConnectWithoutTenantInput[]
    createMany?: DocumentCreateManyTenantInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type TenantsOnUsersCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantsOnUsersCreateWithoutTenantInput, TenantsOnUsersUncheckedCreateWithoutTenantInput> | TenantsOnUsersCreateWithoutTenantInput[] | TenantsOnUsersUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutTenantInput | TenantsOnUsersCreateOrConnectWithoutTenantInput[]
    createMany?: TenantsOnUsersCreateManyTenantInputEnvelope
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
  }

  export type TimesheetCreateNestedManyWithoutTenantInput = {
    create?: XOR<TimesheetCreateWithoutTenantInput, TimesheetUncheckedCreateWithoutTenantInput> | TimesheetCreateWithoutTenantInput[] | TimesheetUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutTenantInput | TimesheetCreateOrConnectWithoutTenantInput[]
    createMany?: TimesheetCreateManyTenantInputEnvelope
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<DocumentCreateWithoutTenantInput, DocumentUncheckedCreateWithoutTenantInput> | DocumentCreateWithoutTenantInput[] | DocumentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutTenantInput | DocumentCreateOrConnectWithoutTenantInput[]
    createMany?: DocumentCreateManyTenantInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type TenantsOnUsersUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantsOnUsersCreateWithoutTenantInput, TenantsOnUsersUncheckedCreateWithoutTenantInput> | TenantsOnUsersCreateWithoutTenantInput[] | TenantsOnUsersUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutTenantInput | TenantsOnUsersCreateOrConnectWithoutTenantInput[]
    createMany?: TenantsOnUsersCreateManyTenantInputEnvelope
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
  }

  export type TimesheetUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TimesheetCreateWithoutTenantInput, TimesheetUncheckedCreateWithoutTenantInput> | TimesheetCreateWithoutTenantInput[] | TimesheetUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutTenantInput | TimesheetCreateOrConnectWithoutTenantInput[]
    createMany?: TimesheetCreateManyTenantInputEnvelope
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
  }

  export type DocumentUpdateManyWithoutTenantNestedInput = {
    create?: XOR<DocumentCreateWithoutTenantInput, DocumentUncheckedCreateWithoutTenantInput> | DocumentCreateWithoutTenantInput[] | DocumentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutTenantInput | DocumentCreateOrConnectWithoutTenantInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutTenantInput | DocumentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: DocumentCreateManyTenantInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutTenantInput | DocumentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutTenantInput | DocumentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type TenantsOnUsersUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantsOnUsersCreateWithoutTenantInput, TenantsOnUsersUncheckedCreateWithoutTenantInput> | TenantsOnUsersCreateWithoutTenantInput[] | TenantsOnUsersUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutTenantInput | TenantsOnUsersCreateOrConnectWithoutTenantInput[]
    upsert?: TenantsOnUsersUpsertWithWhereUniqueWithoutTenantInput | TenantsOnUsersUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantsOnUsersCreateManyTenantInputEnvelope
    set?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    disconnect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    delete?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    update?: TenantsOnUsersUpdateWithWhereUniqueWithoutTenantInput | TenantsOnUsersUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantsOnUsersUpdateManyWithWhereWithoutTenantInput | TenantsOnUsersUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantsOnUsersScalarWhereInput | TenantsOnUsersScalarWhereInput[]
  }

  export type TimesheetUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TimesheetCreateWithoutTenantInput, TimesheetUncheckedCreateWithoutTenantInput> | TimesheetCreateWithoutTenantInput[] | TimesheetUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutTenantInput | TimesheetCreateOrConnectWithoutTenantInput[]
    upsert?: TimesheetUpsertWithWhereUniqueWithoutTenantInput | TimesheetUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TimesheetCreateManyTenantInputEnvelope
    set?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    disconnect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    delete?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    update?: TimesheetUpdateWithWhereUniqueWithoutTenantInput | TimesheetUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TimesheetUpdateManyWithWhereWithoutTenantInput | TimesheetUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TimesheetScalarWhereInput | TimesheetScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<DocumentCreateWithoutTenantInput, DocumentUncheckedCreateWithoutTenantInput> | DocumentCreateWithoutTenantInput[] | DocumentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutTenantInput | DocumentCreateOrConnectWithoutTenantInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutTenantInput | DocumentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: DocumentCreateManyTenantInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutTenantInput | DocumentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutTenantInput | DocumentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type TenantsOnUsersUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantsOnUsersCreateWithoutTenantInput, TenantsOnUsersUncheckedCreateWithoutTenantInput> | TenantsOnUsersCreateWithoutTenantInput[] | TenantsOnUsersUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantsOnUsersCreateOrConnectWithoutTenantInput | TenantsOnUsersCreateOrConnectWithoutTenantInput[]
    upsert?: TenantsOnUsersUpsertWithWhereUniqueWithoutTenantInput | TenantsOnUsersUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantsOnUsersCreateManyTenantInputEnvelope
    set?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    disconnect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    delete?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    connect?: TenantsOnUsersWhereUniqueInput | TenantsOnUsersWhereUniqueInput[]
    update?: TenantsOnUsersUpdateWithWhereUniqueWithoutTenantInput | TenantsOnUsersUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantsOnUsersUpdateManyWithWhereWithoutTenantInput | TenantsOnUsersUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantsOnUsersScalarWhereInput | TenantsOnUsersScalarWhereInput[]
  }

  export type TimesheetUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TimesheetCreateWithoutTenantInput, TimesheetUncheckedCreateWithoutTenantInput> | TimesheetCreateWithoutTenantInput[] | TimesheetUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TimesheetCreateOrConnectWithoutTenantInput | TimesheetCreateOrConnectWithoutTenantInput[]
    upsert?: TimesheetUpsertWithWhereUniqueWithoutTenantInput | TimesheetUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TimesheetCreateManyTenantInputEnvelope
    set?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    disconnect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    delete?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    connect?: TimesheetWhereUniqueInput | TimesheetWhereUniqueInput[]
    update?: TimesheetUpdateWithWhereUniqueWithoutTenantInput | TimesheetUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TimesheetUpdateManyWithWhereWithoutTenantInput | TimesheetUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TimesheetScalarWhereInput | TimesheetScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTenantsInput = {
    create?: XOR<UserCreateWithoutTenantsInput, UserUncheckedCreateWithoutTenantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTenantsInput
    connect?: UserWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTenantsNestedInput = {
    create?: XOR<UserCreateWithoutTenantsInput, UserUncheckedCreateWithoutTenantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTenantsInput
    upsert?: UserUpsertWithoutTenantsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTenantsInput, UserUpdateWithoutTenantsInput>, UserUncheckedUpdateWithoutTenantsInput>
  }

  export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type TenantCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<TenantCreateWithoutDocumentsInput, TenantUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutDocumentsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<TenantCreateWithoutDocumentsInput, TenantUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutDocumentsInput
    upsert?: TenantUpsertWithoutDocumentsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutDocumentsInput, TenantUpdateWithoutDocumentsInput>, TenantUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserCreateNestedOneWithoutTimesheetsInput = {
    create?: XOR<UserCreateWithoutTimesheetsInput, UserUncheckedCreateWithoutTimesheetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTimesheetsInput
    connect?: UserWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutTimesheetsInput = {
    create?: XOR<TenantCreateWithoutTimesheetsInput, TenantUncheckedCreateWithoutTimesheetsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTimesheetsInput
    connect?: TenantWhereUniqueInput
  }

  export type TimesheetEntryCreateNestedManyWithoutTimesheetInput = {
    create?: XOR<TimesheetEntryCreateWithoutTimesheetInput, TimesheetEntryUncheckedCreateWithoutTimesheetInput> | TimesheetEntryCreateWithoutTimesheetInput[] | TimesheetEntryUncheckedCreateWithoutTimesheetInput[]
    connectOrCreate?: TimesheetEntryCreateOrConnectWithoutTimesheetInput | TimesheetEntryCreateOrConnectWithoutTimesheetInput[]
    createMany?: TimesheetEntryCreateManyTimesheetInputEnvelope
    connect?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
  }

  export type TimesheetEntryUncheckedCreateNestedManyWithoutTimesheetInput = {
    create?: XOR<TimesheetEntryCreateWithoutTimesheetInput, TimesheetEntryUncheckedCreateWithoutTimesheetInput> | TimesheetEntryCreateWithoutTimesheetInput[] | TimesheetEntryUncheckedCreateWithoutTimesheetInput[]
    connectOrCreate?: TimesheetEntryCreateOrConnectWithoutTimesheetInput | TimesheetEntryCreateOrConnectWithoutTimesheetInput[]
    createMany?: TimesheetEntryCreateManyTimesheetInputEnvelope
    connect?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumTimesheetStatusFieldUpdateOperationsInput = {
    set?: $Enums.TimesheetStatus
  }

  export type UserUpdateOneRequiredWithoutTimesheetsNestedInput = {
    create?: XOR<UserCreateWithoutTimesheetsInput, UserUncheckedCreateWithoutTimesheetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTimesheetsInput
    upsert?: UserUpsertWithoutTimesheetsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTimesheetsInput, UserUpdateWithoutTimesheetsInput>, UserUncheckedUpdateWithoutTimesheetsInput>
  }

  export type TenantUpdateOneRequiredWithoutTimesheetsNestedInput = {
    create?: XOR<TenantCreateWithoutTimesheetsInput, TenantUncheckedCreateWithoutTimesheetsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTimesheetsInput
    upsert?: TenantUpsertWithoutTimesheetsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutTimesheetsInput, TenantUpdateWithoutTimesheetsInput>, TenantUncheckedUpdateWithoutTimesheetsInput>
  }

  export type TimesheetEntryUpdateManyWithoutTimesheetNestedInput = {
    create?: XOR<TimesheetEntryCreateWithoutTimesheetInput, TimesheetEntryUncheckedCreateWithoutTimesheetInput> | TimesheetEntryCreateWithoutTimesheetInput[] | TimesheetEntryUncheckedCreateWithoutTimesheetInput[]
    connectOrCreate?: TimesheetEntryCreateOrConnectWithoutTimesheetInput | TimesheetEntryCreateOrConnectWithoutTimesheetInput[]
    upsert?: TimesheetEntryUpsertWithWhereUniqueWithoutTimesheetInput | TimesheetEntryUpsertWithWhereUniqueWithoutTimesheetInput[]
    createMany?: TimesheetEntryCreateManyTimesheetInputEnvelope
    set?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    disconnect?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    delete?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    connect?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    update?: TimesheetEntryUpdateWithWhereUniqueWithoutTimesheetInput | TimesheetEntryUpdateWithWhereUniqueWithoutTimesheetInput[]
    updateMany?: TimesheetEntryUpdateManyWithWhereWithoutTimesheetInput | TimesheetEntryUpdateManyWithWhereWithoutTimesheetInput[]
    deleteMany?: TimesheetEntryScalarWhereInput | TimesheetEntryScalarWhereInput[]
  }

  export type TimesheetEntryUncheckedUpdateManyWithoutTimesheetNestedInput = {
    create?: XOR<TimesheetEntryCreateWithoutTimesheetInput, TimesheetEntryUncheckedCreateWithoutTimesheetInput> | TimesheetEntryCreateWithoutTimesheetInput[] | TimesheetEntryUncheckedCreateWithoutTimesheetInput[]
    connectOrCreate?: TimesheetEntryCreateOrConnectWithoutTimesheetInput | TimesheetEntryCreateOrConnectWithoutTimesheetInput[]
    upsert?: TimesheetEntryUpsertWithWhereUniqueWithoutTimesheetInput | TimesheetEntryUpsertWithWhereUniqueWithoutTimesheetInput[]
    createMany?: TimesheetEntryCreateManyTimesheetInputEnvelope
    set?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    disconnect?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    delete?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    connect?: TimesheetEntryWhereUniqueInput | TimesheetEntryWhereUniqueInput[]
    update?: TimesheetEntryUpdateWithWhereUniqueWithoutTimesheetInput | TimesheetEntryUpdateWithWhereUniqueWithoutTimesheetInput[]
    updateMany?: TimesheetEntryUpdateManyWithWhereWithoutTimesheetInput | TimesheetEntryUpdateManyWithWhereWithoutTimesheetInput[]
    deleteMany?: TimesheetEntryScalarWhereInput | TimesheetEntryScalarWhereInput[]
  }

  export type TimesheetCreateNestedOneWithoutEntriesInput = {
    create?: XOR<TimesheetCreateWithoutEntriesInput, TimesheetUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: TimesheetCreateOrConnectWithoutEntriesInput
    connect?: TimesheetWhereUniqueInput
  }

  export type EnumTimesheetEntryActionFieldUpdateOperationsInput = {
    set?: $Enums.TimesheetEntryAction
  }

  export type TimesheetUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: XOR<TimesheetCreateWithoutEntriesInput, TimesheetUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: TimesheetCreateOrConnectWithoutEntriesInput
    upsert?: TimesheetUpsertWithoutEntriesInput
    connect?: TimesheetWhereUniqueInput
    update?: XOR<XOR<TimesheetUpdateToOneWithWhereWithoutEntriesInput, TimesheetUpdateWithoutEntriesInput>, TimesheetUncheckedUpdateWithoutEntriesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumTimesheetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetStatus | EnumTimesheetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetStatusFilter<$PrismaModel> | $Enums.TimesheetStatus
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumTimesheetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetStatus | EnumTimesheetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetStatus[] | ListEnumTimesheetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetStatusWithAggregatesFilter<$PrismaModel> | $Enums.TimesheetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTimesheetStatusFilter<$PrismaModel>
    _max?: NestedEnumTimesheetStatusFilter<$PrismaModel>
  }

  export type NestedEnumTimesheetEntryActionFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetEntryAction | EnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetEntryActionFilter<$PrismaModel> | $Enums.TimesheetEntryAction
  }

  export type NestedEnumTimesheetEntryActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TimesheetEntryAction | EnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    in?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TimesheetEntryAction[] | ListEnumTimesheetEntryActionFieldRefInput<$PrismaModel>
    not?: NestedEnumTimesheetEntryActionWithAggregatesFilter<$PrismaModel> | $Enums.TimesheetEntryAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTimesheetEntryActionFilter<$PrismaModel>
    _max?: NestedEnumTimesheetEntryActionFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    refreshTokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    refreshTokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TimesheetCreateWithoutUserInput = {
    id?: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutTimesheetsInput
    entries?: TimesheetEntryCreateNestedManyWithoutTimesheetInput
  }

  export type TimesheetUncheckedCreateWithoutUserInput = {
    id?: string
    tenantId: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: TimesheetEntryUncheckedCreateNestedManyWithoutTimesheetInput
  }

  export type TimesheetCreateOrConnectWithoutUserInput = {
    where: TimesheetWhereUniqueInput
    create: XOR<TimesheetCreateWithoutUserInput, TimesheetUncheckedCreateWithoutUserInput>
  }

  export type TimesheetCreateManyUserInputEnvelope = {
    data: TimesheetCreateManyUserInput | TimesheetCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TenantsOnUsersCreateWithoutUserInput = {
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type TenantsOnUsersUncheckedCreateWithoutUserInput = {
    tenantId: string
  }

  export type TenantsOnUsersCreateOrConnectWithoutUserInput = {
    where: TenantsOnUsersWhereUniqueInput
    create: XOR<TenantsOnUsersCreateWithoutUserInput, TenantsOnUsersUncheckedCreateWithoutUserInput>
  }

  export type TenantsOnUsersCreateManyUserInputEnvelope = {
    data: TenantsOnUsersCreateManyUserInput | TenantsOnUsersCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    refreshTokenHash?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type TimesheetUpsertWithWhereUniqueWithoutUserInput = {
    where: TimesheetWhereUniqueInput
    update: XOR<TimesheetUpdateWithoutUserInput, TimesheetUncheckedUpdateWithoutUserInput>
    create: XOR<TimesheetCreateWithoutUserInput, TimesheetUncheckedCreateWithoutUserInput>
  }

  export type TimesheetUpdateWithWhereUniqueWithoutUserInput = {
    where: TimesheetWhereUniqueInput
    data: XOR<TimesheetUpdateWithoutUserInput, TimesheetUncheckedUpdateWithoutUserInput>
  }

  export type TimesheetUpdateManyWithWhereWithoutUserInput = {
    where: TimesheetScalarWhereInput
    data: XOR<TimesheetUpdateManyMutationInput, TimesheetUncheckedUpdateManyWithoutUserInput>
  }

  export type TimesheetScalarWhereInput = {
    AND?: TimesheetScalarWhereInput | TimesheetScalarWhereInput[]
    OR?: TimesheetScalarWhereInput[]
    NOT?: TimesheetScalarWhereInput | TimesheetScalarWhereInput[]
    id?: StringFilter<"Timesheet"> | string
    userId?: StringFilter<"Timesheet"> | string
    tenantId?: StringFilter<"Timesheet"> | string
    totalHours?: FloatFilter<"Timesheet"> | number
    status?: EnumTimesheetStatusFilter<"Timesheet"> | $Enums.TimesheetStatus
    createdAt?: DateTimeFilter<"Timesheet"> | Date | string
    updatedAt?: DateTimeFilter<"Timesheet"> | Date | string
  }

  export type TenantsOnUsersUpsertWithWhereUniqueWithoutUserInput = {
    where: TenantsOnUsersWhereUniqueInput
    update: XOR<TenantsOnUsersUpdateWithoutUserInput, TenantsOnUsersUncheckedUpdateWithoutUserInput>
    create: XOR<TenantsOnUsersCreateWithoutUserInput, TenantsOnUsersUncheckedCreateWithoutUserInput>
  }

  export type TenantsOnUsersUpdateWithWhereUniqueWithoutUserInput = {
    where: TenantsOnUsersWhereUniqueInput
    data: XOR<TenantsOnUsersUpdateWithoutUserInput, TenantsOnUsersUncheckedUpdateWithoutUserInput>
  }

  export type TenantsOnUsersUpdateManyWithWhereWithoutUserInput = {
    where: TenantsOnUsersScalarWhereInput
    data: XOR<TenantsOnUsersUpdateManyMutationInput, TenantsOnUsersUncheckedUpdateManyWithoutUserInput>
  }

  export type TenantsOnUsersScalarWhereInput = {
    AND?: TenantsOnUsersScalarWhereInput | TenantsOnUsersScalarWhereInput[]
    OR?: TenantsOnUsersScalarWhereInput[]
    NOT?: TenantsOnUsersScalarWhereInput | TenantsOnUsersScalarWhereInput[]
    userId?: StringFilter<"TenantsOnUsers"> | string
    tenantId?: StringFilter<"TenantsOnUsers"> | string
  }

  export type DocumentCreateWithoutTenantInput = {
    id?: string
    name: string
    url: string
    uploadedAt?: Date | string
  }

  export type DocumentUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    url: string
    uploadedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutTenantInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutTenantInput, DocumentUncheckedCreateWithoutTenantInput>
  }

  export type DocumentCreateManyTenantInputEnvelope = {
    data: DocumentCreateManyTenantInput | DocumentCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantsOnUsersCreateWithoutTenantInput = {
    user: UserCreateNestedOneWithoutTenantsInput
  }

  export type TenantsOnUsersUncheckedCreateWithoutTenantInput = {
    userId: string
  }

  export type TenantsOnUsersCreateOrConnectWithoutTenantInput = {
    where: TenantsOnUsersWhereUniqueInput
    create: XOR<TenantsOnUsersCreateWithoutTenantInput, TenantsOnUsersUncheckedCreateWithoutTenantInput>
  }

  export type TenantsOnUsersCreateManyTenantInputEnvelope = {
    data: TenantsOnUsersCreateManyTenantInput | TenantsOnUsersCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TimesheetCreateWithoutTenantInput = {
    id?: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTimesheetsInput
    entries?: TimesheetEntryCreateNestedManyWithoutTimesheetInput
  }

  export type TimesheetUncheckedCreateWithoutTenantInput = {
    id?: string
    userId: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: TimesheetEntryUncheckedCreateNestedManyWithoutTimesheetInput
  }

  export type TimesheetCreateOrConnectWithoutTenantInput = {
    where: TimesheetWhereUniqueInput
    create: XOR<TimesheetCreateWithoutTenantInput, TimesheetUncheckedCreateWithoutTenantInput>
  }

  export type TimesheetCreateManyTenantInputEnvelope = {
    data: TimesheetCreateManyTenantInput | TimesheetCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type DocumentUpsertWithWhereUniqueWithoutTenantInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutTenantInput, DocumentUncheckedUpdateWithoutTenantInput>
    create: XOR<DocumentCreateWithoutTenantInput, DocumentUncheckedCreateWithoutTenantInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutTenantInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutTenantInput, DocumentUncheckedUpdateWithoutTenantInput>
  }

  export type DocumentUpdateManyWithWhereWithoutTenantInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutTenantInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: StringFilter<"Document"> | string
    tenantId?: StringFilter<"Document"> | string
    name?: StringFilter<"Document"> | string
    url?: StringFilter<"Document"> | string
    uploadedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type TenantsOnUsersUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantsOnUsersWhereUniqueInput
    update: XOR<TenantsOnUsersUpdateWithoutTenantInput, TenantsOnUsersUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantsOnUsersCreateWithoutTenantInput, TenantsOnUsersUncheckedCreateWithoutTenantInput>
  }

  export type TenantsOnUsersUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantsOnUsersWhereUniqueInput
    data: XOR<TenantsOnUsersUpdateWithoutTenantInput, TenantsOnUsersUncheckedUpdateWithoutTenantInput>
  }

  export type TenantsOnUsersUpdateManyWithWhereWithoutTenantInput = {
    where: TenantsOnUsersScalarWhereInput
    data: XOR<TenantsOnUsersUpdateManyMutationInput, TenantsOnUsersUncheckedUpdateManyWithoutTenantInput>
  }

  export type TimesheetUpsertWithWhereUniqueWithoutTenantInput = {
    where: TimesheetWhereUniqueInput
    update: XOR<TimesheetUpdateWithoutTenantInput, TimesheetUncheckedUpdateWithoutTenantInput>
    create: XOR<TimesheetCreateWithoutTenantInput, TimesheetUncheckedCreateWithoutTenantInput>
  }

  export type TimesheetUpdateWithWhereUniqueWithoutTenantInput = {
    where: TimesheetWhereUniqueInput
    data: XOR<TimesheetUpdateWithoutTenantInput, TimesheetUncheckedUpdateWithoutTenantInput>
  }

  export type TimesheetUpdateManyWithWhereWithoutTenantInput = {
    where: TimesheetScalarWhereInput
    data: XOR<TimesheetUpdateManyMutationInput, TimesheetUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserCreateWithoutTenantsInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    timesheets?: TimesheetCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTenantsInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    timesheets?: TimesheetUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTenantsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantsInput, UserUncheckedCreateWithoutTenantsInput>
  }

  export type TenantCreateWithoutUsersInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutTenantInput
    timesheets?: TimesheetCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutTenantInput
    timesheets?: TimesheetUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type UserUpsertWithoutTenantsInput = {
    update: XOR<UserUpdateWithoutTenantsInput, UserUncheckedUpdateWithoutTenantsInput>
    create: XOR<UserCreateWithoutTenantsInput, UserUncheckedCreateWithoutTenantsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTenantsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTenantsInput, UserUncheckedUpdateWithoutTenantsInput>
  }

  export type UserUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    timesheets?: TimesheetUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    timesheets?: TimesheetUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutTenantNestedInput
    timesheets?: TimesheetUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutTenantNestedInput
    timesheets?: TimesheetUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    timesheets?: TimesheetCreateNestedManyWithoutUserInput
    tenants?: TenantsOnUsersCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    timesheets?: TimesheetUncheckedCreateNestedManyWithoutUserInput
    tenants?: TenantsOnUsersUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timesheets?: TimesheetUpdateManyWithoutUserNestedInput
    tenants?: TenantsOnUsersUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timesheets?: TimesheetUncheckedUpdateManyWithoutUserNestedInput
    tenants?: TenantsOnUsersUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TenantCreateWithoutDocumentsInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantsOnUsersCreateNestedManyWithoutTenantInput
    timesheets?: TimesheetCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutDocumentsInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantsOnUsersUncheckedCreateNestedManyWithoutTenantInput
    timesheets?: TimesheetUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutDocumentsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutDocumentsInput, TenantUncheckedCreateWithoutDocumentsInput>
  }

  export type TenantUpsertWithoutDocumentsInput = {
    update: XOR<TenantUpdateWithoutDocumentsInput, TenantUncheckedUpdateWithoutDocumentsInput>
    create: XOR<TenantCreateWithoutDocumentsInput, TenantUncheckedCreateWithoutDocumentsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutDocumentsInput, TenantUncheckedUpdateWithoutDocumentsInput>
  }

  export type TenantUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantsOnUsersUpdateManyWithoutTenantNestedInput
    timesheets?: TimesheetUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantsOnUsersUncheckedUpdateManyWithoutTenantNestedInput
    timesheets?: TimesheetUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateWithoutTimesheetsInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    tenants?: TenantsOnUsersCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTimesheetsInput = {
    id?: string
    username: string
    email?: string | null
    name: string
    password: string
    role?: $Enums.Role
    birthday?: Date | string | null
    contact?: string | null
    address?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    shouldChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    tenants?: TenantsOnUsersUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTimesheetsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTimesheetsInput, UserUncheckedCreateWithoutTimesheetsInput>
  }

  export type TenantCreateWithoutTimesheetsInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutTenantInput
    users?: TenantsOnUsersCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutTimesheetsInput = {
    id?: string
    name: string
    email: string
    contact: string
    address?: string | null
    description?: string | null
    sss?: string | null
    tin?: string | null
    philhealth?: string | null
    pagibig?: string | null
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutTenantInput
    users?: TenantsOnUsersUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutTimesheetsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutTimesheetsInput, TenantUncheckedCreateWithoutTimesheetsInput>
  }

  export type TimesheetEntryCreateWithoutTimesheetInput = {
    id?: string
    action: $Enums.TimesheetEntryAction
    timestamp?: Date | string
  }

  export type TimesheetEntryUncheckedCreateWithoutTimesheetInput = {
    id?: string
    action: $Enums.TimesheetEntryAction
    timestamp?: Date | string
  }

  export type TimesheetEntryCreateOrConnectWithoutTimesheetInput = {
    where: TimesheetEntryWhereUniqueInput
    create: XOR<TimesheetEntryCreateWithoutTimesheetInput, TimesheetEntryUncheckedCreateWithoutTimesheetInput>
  }

  export type TimesheetEntryCreateManyTimesheetInputEnvelope = {
    data: TimesheetEntryCreateManyTimesheetInput | TimesheetEntryCreateManyTimesheetInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTimesheetsInput = {
    update: XOR<UserUpdateWithoutTimesheetsInput, UserUncheckedUpdateWithoutTimesheetsInput>
    create: XOR<UserCreateWithoutTimesheetsInput, UserUncheckedCreateWithoutTimesheetsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTimesheetsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTimesheetsInput, UserUncheckedUpdateWithoutTimesheetsInput>
  }

  export type UserUpdateWithoutTimesheetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    tenants?: TenantsOnUsersUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTimesheetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    shouldChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    tenants?: TenantsOnUsersUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TenantUpsertWithoutTimesheetsInput = {
    update: XOR<TenantUpdateWithoutTimesheetsInput, TenantUncheckedUpdateWithoutTimesheetsInput>
    create: XOR<TenantCreateWithoutTimesheetsInput, TenantUncheckedCreateWithoutTimesheetsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutTimesheetsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutTimesheetsInput, TenantUncheckedUpdateWithoutTimesheetsInput>
  }

  export type TenantUpdateWithoutTimesheetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutTenantNestedInput
    users?: TenantsOnUsersUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutTimesheetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sss?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    pagibig?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutTenantNestedInput
    users?: TenantsOnUsersUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TimesheetEntryUpsertWithWhereUniqueWithoutTimesheetInput = {
    where: TimesheetEntryWhereUniqueInput
    update: XOR<TimesheetEntryUpdateWithoutTimesheetInput, TimesheetEntryUncheckedUpdateWithoutTimesheetInput>
    create: XOR<TimesheetEntryCreateWithoutTimesheetInput, TimesheetEntryUncheckedCreateWithoutTimesheetInput>
  }

  export type TimesheetEntryUpdateWithWhereUniqueWithoutTimesheetInput = {
    where: TimesheetEntryWhereUniqueInput
    data: XOR<TimesheetEntryUpdateWithoutTimesheetInput, TimesheetEntryUncheckedUpdateWithoutTimesheetInput>
  }

  export type TimesheetEntryUpdateManyWithWhereWithoutTimesheetInput = {
    where: TimesheetEntryScalarWhereInput
    data: XOR<TimesheetEntryUpdateManyMutationInput, TimesheetEntryUncheckedUpdateManyWithoutTimesheetInput>
  }

  export type TimesheetEntryScalarWhereInput = {
    AND?: TimesheetEntryScalarWhereInput | TimesheetEntryScalarWhereInput[]
    OR?: TimesheetEntryScalarWhereInput[]
    NOT?: TimesheetEntryScalarWhereInput | TimesheetEntryScalarWhereInput[]
    id?: StringFilter<"TimesheetEntry"> | string
    timesheetId?: StringFilter<"TimesheetEntry"> | string
    action?: EnumTimesheetEntryActionFilter<"TimesheetEntry"> | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFilter<"TimesheetEntry"> | Date | string
  }

  export type TimesheetCreateWithoutEntriesInput = {
    id?: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTimesheetsInput
    tenant: TenantCreateNestedOneWithoutTimesheetsInput
  }

  export type TimesheetUncheckedCreateWithoutEntriesInput = {
    id?: string
    userId: string
    tenantId: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimesheetCreateOrConnectWithoutEntriesInput = {
    where: TimesheetWhereUniqueInput
    create: XOR<TimesheetCreateWithoutEntriesInput, TimesheetUncheckedCreateWithoutEntriesInput>
  }

  export type TimesheetUpsertWithoutEntriesInput = {
    update: XOR<TimesheetUpdateWithoutEntriesInput, TimesheetUncheckedUpdateWithoutEntriesInput>
    create: XOR<TimesheetCreateWithoutEntriesInput, TimesheetUncheckedCreateWithoutEntriesInput>
    where?: TimesheetWhereInput
  }

  export type TimesheetUpdateToOneWithWhereWithoutEntriesInput = {
    where?: TimesheetWhereInput
    data: XOR<TimesheetUpdateWithoutEntriesInput, TimesheetUncheckedUpdateWithoutEntriesInput>
  }

  export type TimesheetUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTimesheetsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutTimesheetsNestedInput
  }

  export type TimesheetUncheckedUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    refreshTokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimesheetCreateManyUserInput = {
    id?: string
    tenantId: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantsOnUsersCreateManyUserInput = {
    tenantId: string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutTimesheetsNestedInput
    entries?: TimesheetEntryUpdateManyWithoutTimesheetNestedInput
  }

  export type TimesheetUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: TimesheetEntryUncheckedUpdateManyWithoutTimesheetNestedInput
  }

  export type TimesheetUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantsOnUsersUpdateWithoutUserInput = {
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type TenantsOnUsersUncheckedUpdateWithoutUserInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantsOnUsersUncheckedUpdateManyWithoutUserInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type DocumentCreateManyTenantInput = {
    id?: string
    name: string
    url: string
    uploadedAt?: Date | string
  }

  export type TenantsOnUsersCreateManyTenantInput = {
    userId: string
  }

  export type TimesheetCreateManyTenantInput = {
    id?: string
    userId: string
    totalHours?: number
    status?: $Enums.TimesheetStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantsOnUsersUpdateWithoutTenantInput = {
    user?: UserUpdateOneRequiredWithoutTenantsNestedInput
  }

  export type TenantsOnUsersUncheckedUpdateWithoutTenantInput = {
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantsOnUsersUncheckedUpdateManyWithoutTenantInput = {
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type TimesheetUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTimesheetsNestedInput
    entries?: TimesheetEntryUpdateManyWithoutTimesheetNestedInput
  }

  export type TimesheetUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: TimesheetEntryUncheckedUpdateManyWithoutTimesheetNestedInput
  }

  export type TimesheetUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalHours?: FloatFieldUpdateOperationsInput | number
    status?: EnumTimesheetStatusFieldUpdateOperationsInput | $Enums.TimesheetStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetEntryCreateManyTimesheetInput = {
    id?: string
    action: $Enums.TimesheetEntryAction
    timestamp?: Date | string
  }

  export type TimesheetEntryUpdateWithoutTimesheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumTimesheetEntryActionFieldUpdateOperationsInput | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetEntryUncheckedUpdateWithoutTimesheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumTimesheetEntryActionFieldUpdateOperationsInput | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimesheetEntryUncheckedUpdateManyWithoutTimesheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumTimesheetEntryActionFieldUpdateOperationsInput | $Enums.TimesheetEntryAction
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}