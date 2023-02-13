export type ConcealedToken = symbol;

export type AzureCredentials = {
  authType: 'clientsecret';
  tenantId?: string;
  clientId?: string;
  clientSecret?: string | ConcealedToken;
};
