interface UpdateId {
  name: string;
  provider: string;
  version: string;
}

// https://learn.microsoft.com/en-us/rest/api/deviceupdate/2022-10-01/device-update/list-updates?tabs=HTTP#update
// TODO: instructions type
interface Update {
  compatibility: Array<{}>;
  createdDateTime: string;
  description: string;
  etag: string;
  friendlyName: string;
  importedDateTime: string;
  installedCriteria: string;
  instructions: unknown;
  isDeployable: boolean;
  manifestVersion: string;
  referencedBy: UpdateId[];
  scanResult: string;
  updateId: UpdateId;
  updateType: string;
}

export interface UpdateList {
  nextLink: string;
  value: Update[];
}
