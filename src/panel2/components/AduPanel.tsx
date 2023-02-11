import { PanelProps } from '@grafana/data';
import { Button, HorizontalGroup, VerticalGroup } from '@grafana/ui';
import React, { FunctionComponent } from 'react';

import { Options } from '../types';

interface Props extends PanelProps<Options> {}

const AduPanel: FunctionComponent<Props> = ({ data }) => {
  console.log(data.series);
  return (
    <div>
      <VerticalGroup justify="center">
        <p>Hello</p>
        <p>World</p>
      </VerticalGroup>
      <HorizontalGroup justify="center" align="center">
        <Button>Deploy</Button>
        <Button variant="destructive">Stop</Button>
        <Button variant="secondary">Cancel</Button>
      </HorizontalGroup>
    </div>
  );
};

export default AduPanel;
