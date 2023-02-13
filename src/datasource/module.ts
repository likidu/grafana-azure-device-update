import { DataSourcePlugin } from '@grafana/data';

import ConfigEditor from './components/ConfigEditor';
import QueryEditor from './components/QueryEditor';
import DataSource from './DataSource';
import { AduDataSourceOptions, AduDataSourceSecureOptions, MyQuery } from './types';

export const plugin = new DataSourcePlugin<DataSource, MyQuery, AduDataSourceOptions, AduDataSourceSecureOptions>(
  DataSource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
