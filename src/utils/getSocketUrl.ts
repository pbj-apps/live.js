import { isEmpty } from 'lodash';
import { environmentMapping } from '.././Live/constants';
import { socketPrefix } from '../config';

const { production } = environmentMapping;

const getSocketUrl = (environment: string): string => {
  // defaults to production
  const backendDomain = isEmpty(environmentMapping[environment])
    ? production
    : environmentMapping[environment];
  return `${socketPrefix}${backendDomain}`;
};

export default getSocketUrl;
