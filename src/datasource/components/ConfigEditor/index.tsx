import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React, { useCallback, useMemo } from 'react';

import { AduDataSourceOptions, AduDataSourceSecureOptions } from '../../types';
import { getCredentials, updateCredentials } from './AzureCredentials';
import AzureCredentialsConfig from './AzureCredentialsConfig';
import { AzureCredentials } from './AzureCredentialsTypes';
import ConfigHelp from './ConfigHelp';
import EndpointConfig from './EndpointConfig';

interface Props extends DataSourcePluginOptionsEditorProps<AduDataSourceOptions, AduDataSourceSecureOptions> {}

const ConfigEditor: React.FC<Props> = (props) => {
  const { options, onOptionsChange } = props;
  const { jsonData } = options;

  const credentials = useMemo(() => getCredentials(options), [options]);

  const updateJsonData = useCallback(
    <T extends keyof AduDataSourceOptions>(fieldName: T, value: AduDataSourceOptions[T]) => {
      onOptionsChange({
        ...options,
        jsonData: {
          ...jsonData,
          [fieldName]: value,
        },
      });
    },
    [jsonData, onOptionsChange, options]
  );

  const onCredentialsChange = (credentials: AzureCredentials): void => {
    onOptionsChange(updateCredentials(options, credentials));
  };
  return (
    <div>
      <ConfigHelp />

      <EndpointConfig options={options} onOptionsChange={onOptionsChange} updateJsonData={updateJsonData} />

      <AzureCredentialsConfig credentials={credentials} onCredentialsChange={onCredentialsChange} />
    </div>
  );
};

export default ConfigEditor;
