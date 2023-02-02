import { DataSourcePlugin } from '@grafana/data';

import ConfigEditor from './components/ConfigEditor';
import { DataSource } from './DataSource';
import { QueryEditor } from './QueryEditor';
import { AduDataSourceOptions, AduDataSourceSecureOptions, MyQuery } from './types';

export const plugin = new DataSourcePlugin<DataSource, MyQuery, AduDataSourceOptions, AduDataSourceSecureOptions>(
  DataSource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
