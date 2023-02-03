import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { FieldSet, InlineField, Input } from '@grafana/ui';
import React from 'react';

import { AduDataSourceOptions, AduDataSourceSecureOptions } from 'datasource/types';

interface Props extends DataSourcePluginOptionsEditorProps<AduDataSourceOptions, AduDataSourceSecureOptions> {
  updateJsonData: <T extends keyof AduDataSourceOptions>(fieldName: T, value: AduDataSourceOptions[T]) => void;
}

const EndpointConfig: React.FC<Props> = (props) => {
  const { options, updateJsonData } = props;
  const { jsonData } = options;

  return (
    <FieldSet label="Endpoint Details">
      <InlineField
        label="Endpoint URL"
        labelWidth={18}
        tooltip="The endpoint url for your Azure Device Update instance. (without https://)"
      >
        <Input
          value={jsonData.endpoint}
          id="adu-endpoint-url"
          placeholder="yourendpoint.api.adu.microsoft.com"
          width={60}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => updateJsonData('endpoint', ev.target.value)}
        />
      </InlineField>

      <InlineField
        label="Instance Name"
        labelWidth={18}
        tooltip="Instance Name that links Azure Device Update to your IoT Hub."
      >
        <Input
          value={jsonData.instanceName}
          id="adu-instance-name"
          placeholder="instance-name"
          width={60}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => updateJsonData('instanceName', ev.target.value)}
        />
      </InlineField>
    </FieldSet>
  );
};

export default EndpointConfig;
