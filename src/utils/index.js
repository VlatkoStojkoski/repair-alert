export { default as useGeolocation } from './useGeolocation';

export const toFirstUpperCase = str =>
  typeof str === 'string' &&
  str[0].toUpperCase() + str.substring(1).toLowerCase();
