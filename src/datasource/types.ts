import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  deviceManagementParams: {
    groupId?: string;
    deploymentId?: string;
  };
  deviceUpdateParams: {
    name?: string;
    provider?: string;
    version?: string;
  };
  queryText?: string;
  constant: number;
}

export const defaultQuery: Partial<MyQuery> = {
  constant: 6.5,
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
