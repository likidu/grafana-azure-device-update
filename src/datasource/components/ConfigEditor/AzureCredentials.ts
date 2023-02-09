import { DataSourceSettings } from '@grafana/data';

import { AzureCredentials, ConcealedToken } from './AzureCredentialsTypes';

const concealed: ConcealedToken = Symbol('Concealed client secret');
const concealedLegacy: ConcealedToken = Symbol('Concealed legacy client secret');

function getSecret(options: DataSourceSettings<any, any>): undefined | string | ConcealedToken {
  if (options.secureJsonFields.azureCrientSecret) {
    // The secret is concealed on server
    return concealed;
  } else if (options.secureJsonFields.clientSecret) {
    // A legacy secret field was preserved during migration
    return concealedLegacy;
  } else {
    const secret = options.secureJsonData?.azureCrientSecret;
    return typeof secret === 'string' && secret.length > 0 ? secret : undefined;
  }
}

export function getCredentials(options: DataSourceSettings<any, any>): AzureCredentials {
  const credentials = options.jsonData.azureCredentials as AzureCredentials | undefined;

  // If no credentials saved then return default credentials
  if (!credentials) {
    return { authType: 'clientsecret' };
  }

  return {
    authType: credentials.authType,
    tenantId: credentials.tenantId,
    clientId: credentials.clientId,
    clientSecret: getSecret(options),
  };
}

export function updateCredentials(
  options: DataSourceSettings<any, any>,
  credentials: AzureCredentials
): DataSourceSettings<any, any> {
  // Apply updated credentials
  options = {
    ...options,
    jsonData: {
      ...options.jsonData,
      azureCredentials: {
        authType: credentials.authType,
        tenantId: credentials.tenantId,
        clientId: credentials.clientId,
      },
    },
    secureJsonData: {
      ...options.secureJsonData,
      azureCrientSecret:
        typeof credentials.clientSecret === 'string' && credentials.clientSecret.length > 0
          ? credentials.clientSecret
          : undefined,
    },
    secureJsonFields: {
      ...options.secureJsonFields,
      azureCrientSecret: credentials.clientSecret === concealed,
      clientSecret: credentials.clientSecret === concealedLegacy,
    },
  };

  return options;
}
