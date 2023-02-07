import { DataSourceSettings } from '@grafana/data';

import { AzureCredentials, ConcealedToken } from './AzureCredentialsTypes';

const concealed: ConcealedToken = Symbol('Concealed client secret');
const concealedLegacy: ConcealedToken = Symbol('Concealed legacy client secret');

function getSecret(options: DataSourceSettings<any, any>): undefined | string | ConcealedToken {
  if (options.secureJsonFields.azureAccessToken) {
    // The secret is concealed on server
    return concealed;
  } else if (options.secureJsonFields.accessToken) {
    // A legacy secret field was preserved during migration
    return concealedLegacy;
  } else {
    const token = options.secureJsonData?.azureAccessToken;
    return typeof token === 'string' && token.length > 0 ? token : undefined;
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
    accessToken: getSecret(options),
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
      },
    },
    secureJsonData: {
      ...options.secureJsonData,
      azureAccessToken:
        typeof credentials.accessToken === 'string' && credentials.accessToken.length > 0
          ? credentials.accessToken
          : undefined,
    },
    secureJsonFields: {
      ...options.secureJsonFields,
      azureAccessToken: credentials.accessToken === concealed,
      accessToken: credentials.accessToken === concealedLegacy,
    },
  };

  return options;
}
