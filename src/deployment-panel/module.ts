import { PanelPlugin } from '@grafana/data';

import AduDeploymentPanel from './components/AduDeploymentPanel';
import addEditor from './editor';
import { Options } from './types';

export const plugin = new PanelPlugin<Options>(AduDeploymentPanel);

plugin.setPanelOptions((builder) => addEditor(builder));
