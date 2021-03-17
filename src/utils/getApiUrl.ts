import { isEmpty } from 'lodash';
import { environmentMapping } from '.././Live/constants';
import { backendProtocol, apiPrefix } from '../config';

const { production } = environmentMapping;

const getApiUrl = (environment: string): string => {
  // defaults to production
  const backendDomain = isEmpty(environmentMapping[environment])
    ? production
    : environmentMapping[environment];
  return `${backendProtocol}://${backendDomain}/${apiPrefix}`;
};

export default getApiUrl;
