export type ConcealedToken = symbol;

export type AzureCredentials = {
  authType: 'clientsecret';
  accessToken?: string | ConcealedToken;
};
