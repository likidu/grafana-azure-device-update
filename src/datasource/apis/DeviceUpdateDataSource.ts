import { DataSourceApi } from '@grafana/data';

import { AduDataSourceOptions, MyQuery } from '../types';

class DeviceUpdateDataSource extends DataSourceApi<MyQuery, AduDataSourceOptions> {}

export default DeviceUpdateDataSource;
