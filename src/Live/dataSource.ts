import { isEmpty } from 'lodash';
import Live from './index';
import getHeaders from '../utils/getHeaders';

interface RequestBuilderOptions {
  requestHandler: void;
}

/**
 * Intialises the data layer of the library
 */
class DataSource {
  live: Live;
  constructor(liveInstance) {
    this.live = liveInstance;
  }

  /**
   * Handles the API request
   * @param {Object} opts options for the request
   */
  async request(opts) {
    const { headers, method, data, path, auth } = opts;
    const apiUrl = `${this.live.apiUrl}${path}`;

    if (auth) {
      const response = await this.live.auth.getToken();
      headers['Authorization'] = `Bearer ${response.auth_token}`;
    }

    const fetchOptions = {
      method,
      headers,
      ...(!isEmpty(data) && {
        body: JSON.stringify(data),
      }),
    };

    const response = await fetch(apiUrl, fetchOptions)
      .catch((error) => {
        throw error;
      })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    return response;
  }

  /**
   * Builds the request handler
   * @param {Object} options options for the request
   */
  requestBuilder(options) {
    if (options.requestHandler) {
      return options.requestHandler;
    }

    return (...opts) => {
      let requestPath = options.path;

      if (typeof options.path == 'function') {
        requestPath = options.path(...opts);
      }

      return this.request({
        data: options.data || {},
        method: options.method,
        path: requestPath,
        headers: getHeaders(this.live.key),
        auth: options.authenticated || true,
      });
    };
  }

  /**
   * Creates an object of callable functions that retrieve data from
   * the API
   * @param {Array} endpoints List of endpoint configuration
   */
  buildRepository(endpoints) {
    return Object.keys(endpoints).reduce((acc, endpointKey) => {
      acc[endpointKey] = this.requestBuilder(endpoints[endpointKey]);

      return acc;
    }, {});
  }
}

export default DataSource;
