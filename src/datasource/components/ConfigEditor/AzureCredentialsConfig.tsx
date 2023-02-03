import { Button, InlineField, Input } from '@grafana/ui';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { AzureAccessToken } from './AzureCredentialsTypes';

interface Props {
  credentials: AzureAccessToken;
  onCredentialsChange: (updatedCredentials: AzureAccessToken) => void;
}

const AzureCredentialsConfig: FunctionComponent<Props> = (props) => {
  const { credentials, onCredentialsChange } = props;

  const onAccessTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onCredentialsChange) {
      const updated: AzureAccessToken = {
        ...credentials,
        accessToken: event.target.value,
      };
      onCredentialsChange(updated);
    }
  };

  const onAccessTokenReset = () => {
    if (onCredentialsChange) {
      const updated: AzureAccessToken = {
        ...credentials,
        accessToken: '',
      };
      onCredentialsChange(updated);
    }
  };

  return (
    <div>
      {typeof credentials.accessToken === 'symbol' ? (
        <InlineField label="Access Token" labelWidth={18} htmlFor="adu-access-token-configured">
          <div className="width-30" style={{ display: 'flex', gap: '4px' }}>
            <Input
              id="aad-client-secret-configured"
              aria-label="Access Token"
              placeholder="configured"
              disabled={true}
            />
            <Button variant="secondary" type="button" onClick={onAccessTokenReset}>
              Reset
            </Button>
          </div>
        </InlineField>
      ) : (
        <InlineField label="Access Token" labelWidth={18} htmlFor="adu-access-token">
          <Input
            id="aad-client-secret"
            className="width-30"
            aria-label="Access Token"
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            value={credentials.accessToken || ''}
            onChange={onAccessTokenChange}
          />
        </InlineField>
      )}
    </div>
  );
};

export default AzureCredentialsConfig;
