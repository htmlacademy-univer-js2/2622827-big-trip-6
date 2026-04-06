import {FILTER_TYPES} from '../const.js';

const isFuturePoint = (point) => point.dateFrom > new Date();
const isPastPoint = (point) => point.dateTo < new Date();
const isPresentPoint = (point) =>
  point.dateFrom <= new Date() && point.dateTo >= new Date();

const generateFilters = (points) => [
  {
    type: FILTER_TYPES.EVERYTHING,
    name: 'Everything',
    isChecked: true,
    isDisabled: false,
  },
  {
    type: FILTER_TYPES.FUTURE,
    name: 'Future',
    isChecked: false,
    isDisabled: !points.some(isFuturePoint),
  },
  {
    type: FILTER_TYPES.PRESENT,
    name: 'Present',
    isChecked: false,
    isDisabled: !points.some(isPresentPoint),
  },
  {
    type: FILTER_TYPES.PAST,
    name: 'Past',
    isChecked: false,
    isDisabled: !points.some(isPastPoint),
  },
];

export {generateFilters};
