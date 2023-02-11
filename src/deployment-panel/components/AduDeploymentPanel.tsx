import { PanelProps } from '@grafana/data';
import { Button, Card } from '@grafana/ui';
import React, { FunctionComponent } from 'react';

import { Options } from '../types';

const duLogo = require('../img/du-logo.png');

interface Props extends PanelProps<Options> {}

const AduPanel: FunctionComponent<Props> = ({ options, data, replaceVariables }) => {
  // Only accepts API call from get-device
  const apiPathName = 'get-device';
  const variable = replaceVariables('$deviceId');
  const { name: dataName, fields } = data.series[0];

  const getDisplayValues = (fieldName: string) => {
    const targetField = fields.find((field) => field.name === fieldName);
    return targetField?.values.toArray().map((value) => targetField.display!(value));
  };

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
        <img src={duLogo} alt="DU Logo" height={40} width={40} />
      </Card.Figure>
      <Card.Description>
        {dataName === apiPathName && variable && (
          <div>
            <p>{getDisplayValues('deviceId')![0].text}</p>
            <p>{getDisplayValues('groupId')![0].text}</p>
          </div>
        )}
      </Card.Description>
      <Card.Actions>
        <Button>Deploy</Button>
        <Button variant="destructive">Stop</Button>
        <Button variant="secondary">Cancel</Button>
      </Card.Actions>
    </Card>
  );
};

export default AduPanel;
