import type { CodegenConfig } from '@graphql-codegen/cli'

const schema = 'app/server/src/graphql/**/*.graphql'

const config: CodegenConfig = {
  schema,
  documents: ['app/client/src/**/*.graphql'],
  ignoreNoDocuments: false,
  generates: {
    'app/server/src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../common/graphql/graphql-context#GraphqlContext',
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: {
          ObjectId: {
            input: 'mongoose#Types.ObjectId',
            output: 'mongoose#Types.ObjectId',
          },
          Decimal: {
            input: 'string',
            output: 'string',
          },
        },
      },
    },
    'app/client/src/generated/graphql.ts': {
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: {
          ObjectId: {
            input: 'string',
            output: 'string',
          },
          Decimal: {
            input: 'string',
            output: 'string',
          },
        },
      },
    },
  },
}

export default config
