import { PanelPlugin } from '@grafana/data';

import AduPanel from './components/AduPanel';
import addEditor from './editor';
import { Options } from './types';

export const plugin = new PanelPlugin<Options>(AduPanel);

plugin.setPanelOptions((builder) => addEditor(builder));
