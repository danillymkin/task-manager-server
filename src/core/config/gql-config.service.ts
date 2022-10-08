import { GqlOptionsFactory } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLDateTime } from 'graphql-scalars';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    const apiPrefix = this.config.get<string>('API_PREFIX');
    const path = `${apiPrefix}/graphql`;

    return {
      debug: false,
      playground: false,
      autoSchemaFile: true,
      sortSchema: true,
      path,
      resolvers: {
        DateTime: GraphQLDateTime,
      },
      subscriptions: {
        'graphql-ws': true,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    };
  }
}
