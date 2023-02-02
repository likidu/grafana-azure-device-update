export type ConcealedSecret = symbol;

export interface AzureClientSecretCredentials {
  tenantId?: string;
  clientId?: string;
  clientSecret?: string | ConcealedSecret;
}

export type AzureCredentials = AzureClientSecretCredentials;
