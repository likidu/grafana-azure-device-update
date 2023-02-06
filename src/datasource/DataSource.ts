import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';
import { FetchResponse, getBackendSrv, isFetchError } from '@grafana/runtime';
import { map, merge, Observable } from 'rxjs';

import { UpdateList } from './models';
import { AduDataSourceOptions, MyQuery } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

class DataSource extends DataSourceApi<MyQuery, AduDataSourceOptions> {
  private instanceUrl?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<AduDataSourceOptions>) {
    super(instanceSettings);

    this.instanceUrl = instanceSettings.url;
  }

  query(options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
    const observableResponses: Array<Observable<DataQueryResponse>> = options.targets.map((query) => {
      const { refId } = query;
      return this.request<UpdateList>('list-updates').pipe(
        map((response) => this.handleTimeSeriesResponse(response, refId))
      );
    });

    // The query function only returns one observable. we use merge to combine them all?
    return merge(...observableResponses);
  }

  request<T>(path: string, method: HttpMethod = 'GET', params?: string): Observable<FetchResponse<T>> {
    const result = getBackendSrv().fetch<T>({
      url: `${this.instanceUrl}/${path}${params?.length ? `?${params}` : ''}`,
      method,
    });
    return result;
  }

  /**
   * Checks whether we can connect to the API by calling one of the them.
   */
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    const response = this.request<UpdateList>('list-updates');
    const respSubscriber = response.subscribe({
      next(val) {
        if (val.status === 200) {
          return {
            status: 'success',
            message: 'Success',
          };
        } else {
          return {
            status: 'error',
            message: val.statusText ? val.statusText : defaultErrorMessage,
          };
        }
      },
      error(err) {
        let message = '';
        if (typeof err === 'string') {
          message = err;
        } else if (isFetchError(err)) {
          message = 'Fetch error: ' + (err.statusText ? err.statusText : defaultErrorMessage);
          if (err.data && err.data.error && err.data.error.code) {
            message += ': ' + err.data.error.code + '. ' + err.data.error.message;
          }
        }
        return {
          status: 'error',
          message,
        };
      },
      complete() {
        respSubscriber.unsubscribe();
      },
    });
  }

  /**
   * Process responses from a timeseries api call. We need to receive the refId as well, because we add it to the data frame.
   * @param response FetchResponse
   * @param refId query RefId
   */
  private handleTimeSeriesResponse(response: FetchResponse, refId: string): DataQueryResponse {
    if (response.status !== 200) {
      throw new Error(`Unexpected HTTP Response from API: ${response.status} - ${response.statusText}`);
    }

    // Start Parsing the Response
    let frame = new MutableDataFrame({
      refId: refId,
      fields: [],
    });

    let dataset_data: QuandlDataset = response.data.dataset_data as QuandlDataset;
    for (const f of dataset_data.column_names) {
      // The time series data set always has a date and then number fields.
      // With tables we'll probably have to infer data types or just use xml because the xml format shows types. .
      if (f === 'Date') {
        frame.addField({ name: f, type: FieldType.time });
      } else {
        frame.addField({ name: f, type: FieldType.number });
      }
    }

    for (const r of dataset_data.data) {
      frame.appendRow(r);
    }

    // Alert the subscriber that we have new formatted data.
    // Not sure why I have to put it in an object with the array, but it seems to work.
    return { data: [frame] };
  }
}

export default DataSource;
