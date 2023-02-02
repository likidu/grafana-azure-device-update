import { DataSourceSettings } from '@grafana/data';

import { AzureCredentials, ConcealedSecret } from './AzureCredentialsTypes';

const concealed: ConcealedSecret = Symbol('Concealed client secret');
const concealedLegacy: ConcealedSecret = Symbol('Concealed legacy client secret');

function getSecret(options: DataSourceSettings<any, any>): undefined | string | ConcealedSecret {
  if (options.secureJsonFields.azureClientSecret) {
    // The secret is concealed on server
    return concealed;
  } else if (options.secureJsonFields.clientSecret) {
    // A legacy secret field was preserved during migration
    return concealedLegacy;
  } else {
    const secret = options.secureJsonData?.azureClientSecret;
    return typeof secret === 'string' && secret.length > 0 ? secret : undefined;
  }
}

export function getCredentials(options: DataSourceSettings<any, any>): AzureCredentials {
  const credentials = options.jsonData.azureCredentials as AzureCredentials | undefined;

  // If no credentials saved then return default credentials
  if (!credentials) {
    return {};
  }

  return {
    tenantId: credentials.tenantId,
    clientId: credentials.clientId,
    clientSecret: getSecret(options),
  };
}

export function updateCredentials(
  options: DataSourceSettings<any, any>,
  credentials: AzureCredentials
): DataSourceSettings<any, any> {
  // Cleanup legacy credentials
  options = {
    ...options,
    jsonData: {
      ...options.jsonData,
      tenantId: undefined,
      clientId: undefined,
    },
  };

  // Apply updated credentials
  return (options = {
    ...options,
    jsonData: {
      ...options.jsonData,
      azureCredentials: {
        tenantId: credentials.tenantId,
        clientId: credentials.clientId,
      },
    },
    secureJsonData: {
      ...options.secureJsonData,
      azureClientSecret:
        typeof credentials.clientSecret === 'string' && credentials.clientSecret.length > 0
          ? credentials.clientSecret
          : undefined,
    },
    secureJsonFields: {
      ...options.secureJsonFields,
      azureClientSecret: credentials.clientSecret === concealed,
      clientSecret: credentials.clientSecret === concealedLegacy,
    },
  });
}
