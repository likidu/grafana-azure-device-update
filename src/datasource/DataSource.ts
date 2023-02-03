import { DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';

import { AduDataSourceOptions, MyQuery } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

class DataSource extends DataSourceApi<MyQuery, AduDataSourceOptions> {
  private url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<AduDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
  }

  async request<T>(path: string, method: HttpMethod = 'GET', params?: string) {
    try {
      const response = getBackendSrv().fetch<T>({
        url: `${this.url}${path}${params?.length ? `?${params}` : ''}`,
        method,
      });
      return lastValueFrom(response);
    } catch (error) {}
  }
}

export default DataSource;
