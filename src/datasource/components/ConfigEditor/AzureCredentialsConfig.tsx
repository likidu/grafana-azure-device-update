import { Button, FieldSet, InlineField, Input } from '@grafana/ui';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { labelWidth } from 'datasource/constants';
import { AzureCredentials } from './AzureCredentialsTypes';

interface Props {
  credentials: AzureCredentials;
  onCredentialsChange: (updatedCredentials: AzureCredentials) => void;
}

const AzureCredentialsConfig: FunctionComponent<Props> = (props) => {
  const { credentials, onCredentialsChange } = props;

  const onTenantIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onCredentialsChange) {
      const updated: AzureCredentials = {
        ...credentials,
        tenantId: event.target.value,
      };
      onCredentialsChange(updated);
    }
  };

  const onClientIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onCredentialsChange) {
      const updated: AzureCredentials = {
        ...credentials,
        clientId: event.target.value,
      };
      onCredentialsChange(updated);
    }
  };

  const onClientSecretChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onCredentialsChange) {
      const updated: AzureCredentials = {
        ...credentials,
        clientSecret: event.target.value,
      };
      onCredentialsChange(updated);
    }
  };

  const onClientSecretReset = () => {
    if (onCredentialsChange) {
      const updated: AzureCredentials = {
        ...credentials,
        clientSecret: '',
      };
      onCredentialsChange(updated);
    }
  };

  return (
    <FieldSet label="Authentication">
      <InlineField
        label="Directory (tenant) ID"
        labelWidth={labelWidth}
        htmlFor="aad-tenant-id"
        tooltip="Active Directory App Tenant ID"
      >
        <div className="width-15">
          <Input
            id="aad-tenant-id"
            className="width-30"
            aria-label="Tenant ID"
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            value={credentials.tenantId || ''}
            onChange={onTenantIdChange}
          />
        </div>
      </InlineField>
      <InlineField
        label="Application (client) ID"
        labelWidth={labelWidth}
        htmlFor="aad-client-id"
        tooltip="Active Directory App Client ID"
      >
        <div className="width-15">
          <Input
            id="aad-client-id"
            className="width-30"
            aria-label="Client ID"
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            value={credentials.clientId || ''}
            onChange={onClientIdChange}
          />
        </div>
      </InlineField>

      {typeof credentials.clientSecret === 'symbol' ? (
        <InlineField label="Client Secret" labelWidth={labelWidth} htmlFor="aad-client-secret-configured">
          <div className="width-30" style={{ display: 'flex', gap: '4px' }}>
            <Input
              id="aad-client-secret-configured"
              aria-label="Client Secret"
              placeholder="configured"
              disabled={true}
            />
            <Button variant="secondary" type="button" onClick={onClientSecretReset}>
              Reset
            </Button>
          </div>
        </InlineField>
      ) : (
        <InlineField label="Client Secret" labelWidth={labelWidth} htmlFor="aad-client-secret">
          <Input
            id="aad-client-secret"
            className="width-30"
            aria-label="Client Secret"
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            value={credentials.clientSecret || ''}
            onChange={onClientSecretChange}
          />
        </InlineField>
      )}
    </FieldSet>
  );
};

export default AzureCredentialsConfig;
