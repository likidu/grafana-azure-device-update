import { DataQuery, DataSourceJsonData } from '@grafana/data';

export type ApiCategory = 'deviceManagement' | 'deviceUpdate';

export interface MyQuery extends DataQuery {
  apiCategory: ApiCategory;
  apiPath: string;
  apiParam?: string;
  queryText?: string;
}

export const defaultQuery: Partial<MyQuery> = {
  apiCategory: 'deviceManagement',
  apiPath: 'list-devices',
};

export interface DataPoint {
  Time: number;
  Value: number;
}

export interface AduDataSourceResponse {
  datapoints: DataPoint[];
}

/**
 * These are options configured for each DataSource instance
 */
export interface AduDataSourceOptions extends DataSourceJsonData {
  endpoint: string;
  instanceName: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface AduDataSourceSecureOptions {
  azureAccessToken?: string;
}
