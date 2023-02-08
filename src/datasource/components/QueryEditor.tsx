import defaults from 'lodash/defaults';

import { QueryEditorProps } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { Alert, InlineField, InlineFieldRow, Select } from '@grafana/ui';

import React, { FunctionComponent } from 'react';
import DataSource from '../DataSource';
import { AduDataSourceOptions, ApiCategory, defaultQuery, MyQuery } from '../types';

const pluginJson = require('../plugin.json');

type Props = QueryEditorProps<DataSource, MyQuery, AduDataSourceOptions>;

const QueryEditor: FunctionComponent<Props> = (props) => {
  const { onChange, onRunQuery } = props;

  const query = defaults(props.query, defaultQuery);
  const { apiCategory, apiPath, apiParam } = query;

  const apiCategories = [
    { id: 'deviceManagement', label: 'Devie Management' },
    { id: 'deviceUpdate', label: 'Devie Update' },
  ];

  const { routes } = pluginJson;

  const apiPaths = [
    {
      category: 'deviceManagement',
      paths: [
        // https://learn.microsoft.com/en-us/rest/api/deviceupdate/2022-10-01/device-management/get-device?tabs=HTTP
        {
          id: 'get-device',
          label: 'Get Device',
          tooltip:
            'Gets the device properties and latest deployment status for a device connected to Device Update for IoT Hub.',
        },
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
    onChange({ ...query, apiPath: path, apiParam: undefined });
    // executes the query
    onRunQuery();
  };

  const onParamChange = (param: string) => {
    onChange({ ...query, apiParam: param });
    // executes the query
    onRunQuery();
  };

  // Helper function to extract the values of a variable instead of interpolating it.
  const getVariable = (name: any): string[] => {
    const values: string[] = [];

    // Instead of interpolating the string, we collect the values in an array.
    getTemplateSrv().replace(`$${name}`, {}, (value: string | string[]) => {
      if (Array.isArray(value)) {
        values.push(...value);
      } else {
        values.push(value);
      }

      // We don't really care about the string here.
      return '';
    });

    return values;
  };

  const vars = getTemplateSrv()
    .getVariables()
    .map((v) => ({ id: v.name, label: v.name, value: getVariable(v.name) }));

  return (
    <div>
      <Alert title="API Explorer" severity="info">
        <p>
          The features listed here are experimental. They might change or be removed without notice. In the tooltip for
          each feature, there&apos;s a link to a pull request where you can submit feedback for that feature.
        </p>
      </Alert>
      <InlineFieldRow>
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
      </InlineFieldRow>

      {apiPath === 'get-device' && (
        <InlineFieldRow>
          <InlineField
            label="Parameter: deviceId"
            labelWidth={25}
            htmlFor="adu-api-param"
            tooltip="API Parameter from Variable"
          >
            <Select
              id="adu-api-param"
              aria-label="Parameter: deviceId"
              value={vars.find((v) => v.id === apiParam)}
              options={vars}
              onChange={(val) => onParamChange(val.id)}
            />
          </InlineField>
        </InlineFieldRow>
      )}
    </div>
  );
};

export default QueryEditor;
