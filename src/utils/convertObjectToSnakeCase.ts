import { reduce, snakeCase } from 'lodash';

// TODO: extend to work on multi levels of the object
export default function convertObjectToSnakeCase(object: {
  [key: string]: any;
}): { [key: string]: any } {
  return reduce(
    object,
    (updatedObject, value, key) => ({
      ...updatedObject,
      [snakeCase(key)]: value,
    }),
    {},
  );
}
