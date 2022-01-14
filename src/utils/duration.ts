import { isEmpty, split, toNumber } from 'lodash';

export const convertStringToSeconds = (durationString: string): number => {
  if (isEmpty(durationString)) {
    return 0;
  }
  const hmsValues = split(durationString, ':');

  if (hmsValues.length < 3) {
    return toNumber(hmsValues[0]) * 60 + toNumber(split(hmsValues[1], '.')[0]);
  }
  return (
    toNumber(hmsValues[0]) * 3600 +
    toNumber(hmsValues[1]) * 60 +
    toNumber(split(hmsValues[2], '.')[0])
  );
};
