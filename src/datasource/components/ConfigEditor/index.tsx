import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React, { useMemo } from 'react';

import { AduDataSourceOptions, AduDataSourceSecureOptions } from '../../types';
import { getCredentials, updateCredentials } from './AzureCredentials';
import AzureCredentialsConfig from './AzureCredentialsConfig';
import { AzureCredentials } from './AzureCredentialsTypes';
import ConfigHelp from './ConfigHelp';

interface Props extends DataSourcePluginOptionsEditorProps<AduDataSourceOptions, AduDataSourceSecureOptions> {}

const ConfigEditor: React.FC<Props> = (props) => {
  const { options, onOptionsChange } = props;

  const credentials = useMemo(() => getCredentials(options), [options]);

  const onCredentialsChange = (credentials: AzureCredentials): void => {
    onOptionsChange(updateCredentials(options, credentials));
  };
  return (
    <div>
      <ConfigHelp />

      <h3 className="page-heading">Authentication</h3>
      <AzureCredentialsConfig credentials={credentials} onCredentialsChange={onCredentialsChange} />
    </div>
  );
};

export default ConfigEditor;
