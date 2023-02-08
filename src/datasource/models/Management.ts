import { AduResponse } from './General';
import { UpdateInfo } from './Update';

interface StepResult {
  description: string;
  extendedResultCode: number;
  resultCode: number;
  resultDetails: string;
  update: UpdateInfo;
}

interface InstallResult {
  extendedResultCode: number;
  resultCode: number;
  resultDetails: string;
  stepResults: StepResult[];
}

interface DeviceDeploymentState {
  Cancelled: string;
  Failed: string;
  InProgress: string;
  Success: string;
}

interface Device {
  deploymentStatus: DeviceDeploymentState;
  deviceClassId: string;
  deviceId: string;
  groupId: string;
  installedUpdate: UpdateInfo;
  lastAttemptedUpdate: UpdateInfo;
  lastDeploymentId: string;
  lastInstallResult: InstallResult;
  moudleId: string;
  onLastUpdate: boolean;
}

export interface DeviceList extends AduResponse {
  value: Device[];
}
