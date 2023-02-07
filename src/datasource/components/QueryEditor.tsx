import defaults from 'lodash/defaults';

import { QueryEditorProps } from '@grafana/data';
import { InlineField, Select } from '@grafana/ui';
import React, { FunctionComponent } from 'react';
import DataSource from '../DataSource';
import { AduDataSourceOptions, ApiCategory, defaultQuery, MyQuery } from '../types';

const pluginJson = require('../plugin.json');

type Props = QueryEditorProps<DataSource, MyQuery, AduDataSourceOptions>;

const QueryEditor: FunctionComponent<Props> = (props) => {
  const { onChange, onRunQuery } = props;

  const query = defaults(props.query, defaultQuery);
  const { apiCategory, apiPath } = query;

  const apiCategories = [
    { id: 'deviceManagement', label: 'Devie Management' },
    { id: 'deviceUpdate', label: 'Devie Update' },
  ];

  const { routes } = pluginJson;

  const apiPaths = [
    {
      category: 'deviceManagement',
      paths: [
        {
          id: 'list-devices',
          label: 'List Devices',
          tooltip: 'Gets a list of devices connected to Device Update for IoT Hub.',
        },
        {
          id: 'list-device-classes',
          label: 'List Device Classes',
          tooltip:
            'Gets a list of all device classes (sets of devices compatible with the same updates based on reported Device Update PnP model.',
        },
      ],
    },
    {
      category: 'deviceUpdate',
      paths: [
        {
          id: 'list-updates',
          label: 'List Updates',
          tooltip: 'Get a list of all updates that have been imported to Device Update for IoT Hub.',
        },
      ],
    },
  ];

  const paths = apiPaths.find((group) => group.category === apiCategory)!.paths;

  const onCategoryChange = (category: ApiCategory) => {
    onChange({ ...query, apiCategory: category });
  };

  const onPathChange = (path: string) => {
    console.log(path);
    onChange({ ...query, apiPath: path });
    // executes the query
    onRunQuery();
  };

  return (
    <div className="gf-form">
      <InlineField label="API Category" labelWidth={18} htmlFor="adu-api-category">
        <Select
          id="adu-api-category"
          aria-label="API Category"
          value={apiCategories.find((v) => v.id === apiCategory)}
          options={apiCategories}
          onChange={(val) => onCategoryChange(val.id)}
        />
      </InlineField>
      <InlineField label="Path" labelWidth={18} htmlFor="adu-api-path">
        <Select
          id="adu-api-path"
          aria-label="Path"
          value={paths.find((v) => v.id === apiPath)}
          options={paths}
          onChange={(val) => onPathChange(val.id)}
        />
      </InlineField>
    </div>
  );
};

export default QueryEditor;
