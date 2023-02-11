import { PanelOptionsEditorBuilder } from '@grafana/data';
import { Button, Field } from '@grafana/ui';
import React, { Fragment, FunctionComponent } from 'react';

import { ButtonOptions, Options } from './types';

interface Props {
  buttons: ButtonOptions[];
  onChange: (buttons: ButtonOptions[]) => void;
}

const Editor: FunctionComponent<Props> = ({ buttons, onChange }) => {
  return (
    <Fragment>
      <Field>
        <Button>Add Button</Button>
      </Field>
    </Fragment>
  );
};

function addEditor(builder: PanelOptionsEditorBuilder<Options>) {
  builder
    .addRadio({
      path: 'orientation',
      name: 'Orientation',
      description: 'Stacking direction in case of multiple buttons',
      defaultValue: 'horizontal',
      settings: {
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
      },
    })
    .addCustomEditor({
      id: 'buttons',
      path: 'buttons',
      name: 'Button Configuration',
      defaultValue: [{ text: '', datasource: '', query: '' }],
      editor: (props) => <Editor buttons={props.value} onChange={props.onChange} />,
    });
}

export default addEditor;
