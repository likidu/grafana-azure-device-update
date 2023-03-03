import { PanelProps } from '@grafana/data';
import { FetchResponse, getBackendSrv } from '@grafana/runtime';
import { Alert, Button, Card } from '@grafana/ui';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { lastValueFrom } from 'rxjs';
import uuid4 from 'uuid4';

import { Deployment, Device } from 'datasource/models';
import { HttpMethod } from 'models';
import { Options } from '../types';

const logo = require('../img/du-logo.png');

interface Props extends PanelProps<Options> {}

const AduPanel: FunctionComponent<Props> = ({ options, replaceVariables }) => {
  const variable = replaceVariables('$deviceId');

  const [deviceId, setDeviceId] = useState('');
  const [device, setDevice] = useState<Device>();

  const request = <T,>(path: string, method: HttpMethod = 'GET', params?: string): Promise<FetchResponse<T>> => {
    // TODO: The '1' seems to be too hard coded?
    const result = getBackendSrv().fetch<T>({
      url: `/api/datasources/proxy/1/${path}/${params?.length ? `${params}` : ''}?api-version=2022-10-01`,
      method,
    });
    return lastValueFrom(result);
  };

  const onCreateDeployment = async (groupId: string) => {
    const deploymentId = uuid4();
    try {
      const { data } = await request<Deployment>('create-deployment', 'PUT', `${groupId}/deployments/${deploymentId}`);
    } catch (error) {}
  };

  // Update deviceId state based on the variable deviceId
  useEffect(() => {
    setDeviceId(variable);
  }, [deviceId, variable]);

  // Get device information
  // https://learn.microsoft.com/en-us/rest/api/deviceupdate/2022-10-01/device-management/get-device?tabs=HTTP
  useEffect(() => {
    if (deviceId !== '') {
      (async () => {
        try {
          const { data } = await request<Device>('get-device', 'GET', deviceId);
          console.log(data);
          setDevice({ ...data, ...(!data.groupId && { groupId: '$default' }) });
          // setDevice(data);
        } catch (error) {
          setDevice(undefined);
        }
      })();
    }
  }, [deviceId]);

  // Get best updates for device class subgroup
  // https://learn.microsoft.com/en-us/rest/api/deviceupdate/2022-10-01/device-management/get-best-updates-for-device-class-subgroup?tabs=HTTP
  // useEffect(() => {
  //   if (device) {
  //     (async () => {
  //       try {
  //         const { data } = await request<Device>(
  //           'get-best-updates',
  //           'GET',
  //           `${device?.groupId}/deviceClassSubgroups/${device?.deviceClassId}/bestUpdates`
  //         );
  //         console.log(data);
  //         setDevice(data);
  //       } catch (error) {
  //         setDevice(undefined);
  //       }
  //     })();
  //   }
  // }, [device]);

  return (
    <Card>
      <Card.Heading>
        <h4>Firmware deployment</h4>
      </Card.Heading>
      <Card.Meta>
        {['Link to Azure Portal']}
        <a
          key="link"
          href="https://portal.azure.com/#@liya.design/resource/subscriptions/3d6766a6-f481-4045-965b-7c3125c936b8/resourceGroups/Pomelo/providers/Microsoft.DeviceUpdate/accounts/pomelo-adu/overview"
        >
          https://portal.azure.com/my-adu
        </a>
      </Card.Meta>
      <Card.Figure>
        <img src={logo} alt="DU Logo" height={40} width={40} />
      </Card.Figure>
      <Card.Description>
        {deviceId !== '' && device ? (
          <div>
            <p>{device.deviceId}</p>
            <p>{device.deviceClassId}</p>
            <p>{device.groupId}</p>
          </div>
        ) : (
          <Alert title="No deviceId variable for the dashboard" severity="error">
            <p>
              Please set the <strong>$deviceId</strong> variable for the dashboard. This panel requires it to fetch the
              corresponding device info from the Device Update for IoT Hub.
            </p>
          </Alert>
        )}
      </Card.Description>
      <Card.Actions>
        <Button onClick={() => onCreateDeployment(device.groupId)}>Deploy</Button>
        <Button variant="destructive">Stop</Button>
        <Button variant="secondary">Cancel</Button>
      </Card.Actions>
    </Card>
  );
};

export default AduPanel;
