const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FILTER_NAMES = {
  [FILTER_TYPES.EVERYTHING]: 'Everything',
  [FILTER_TYPES.FUTURE]: 'Future',
  [FILTER_TYPES.PRESENT]: 'Present',
  [FILTER_TYPES.PAST]: 'Past',
};

const EMPTY_LIST_MESSAGE = {
  [FILTER_TYPES.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPES.FUTURE]: 'There are no future events now',
  [FILTER_TYPES.PRESENT]: 'There are no present events now',
  [FILTER_TYPES.PAST]: 'There are no past events now',
};

const SORT_TYPES = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const USER_ACTIONS = {
  UPDATE_POINT: 'updatePoint',
  ADD_POINT: 'addPoint',
  DELETE_POINT: 'deletePoint',
};

const UPDATE_TYPES = {
  POINTS_LIST: 'pointsListChange',
  FILTER: 'filterTypeChange',
};

const FAILED_LOAD_MESSAGE = 'Failed to load latest route information';
const FAILED_LOAD_POINTS_MESSAGE = 'Failed to load points';
const FAILED_LOAD_DESTINATIONS_MESSAGE = 'Failed to load destinations';
const FAILED_LOAD_OFFERS_MESSAGE = 'Failed to load offers';
const LOADING_MESSAGE = 'Loading...';

const API_URL = 'https://23.objects.htmlacademy.pro/big-trip';

const ENDPOINTS = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

const HTTP_METHODS = {
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const CONTENT_TYPE = 'application/json';

const DEFAULT_POINT_TYPE = 'flight';
const DEFAULT_CREATE_PRICE = 0;
const MIN_CREATE_PRICE = 0;
const MIN_POINT_PRICE = 1;
const PRICE_STEP = 1;

const OFFER_ID_PREFIX = 'event-offer-';

const FLATPICKR_DATE_TIME_FORMAT = 'd/m/y H:i';

const KEYBOARD_KEYS = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
};

const DATE_FORMATS = {
  POINT_DATE: 'MMM DD',
  POINT_TIME: 'HH:mm',
  EDIT_FORM: 'DD/MM/YY HH:mm',
  TRIP_MONTH: 'MMM',
  TRIP_DAY: 'D',
  TRIP_DAY_MONTH: 'D MMM',
};

const MAX_ROUTE_CITIES = 3;

const SAVE_BUTTON_DEFAULT_TEXT = 'Save';
const SAVE_BUTTON_SAVING_TEXT = 'Saving...';
const DELETE_BUTTON_DEFAULT_TEXT = 'Delete';
const DELETE_BUTTON_DELETING_TEXT = 'Deleting...';
const CANCEL_BUTTON_TEXT = 'Cancel';

const AUTH_TOKEN_RADIX = 36;
const AUTH_TOKEN_START = 2;
const AUTH_TOKEN_END = 14;
const AUTHORIZATION_PREFIX = 'Basic ';

const UI_BLOCKER_LOWER_LIMIT = 350;
const UI_BLOCKER_UPPER_LIMIT = 500;

const PAD_LENGTH = 2;
const PAD_FILL = '0';

export {
  POINT_TYPES,
  FILTER_TYPES,
  FILTER_NAMES,
  EMPTY_LIST_MESSAGE,
  SORT_TYPES,
  USER_ACTIONS,
  UPDATE_TYPES,
  FAILED_LOAD_MESSAGE,
  FAILED_LOAD_POINTS_MESSAGE,
  FAILED_LOAD_DESTINATIONS_MESSAGE,
  FAILED_LOAD_OFFERS_MESSAGE,
  LOADING_MESSAGE,
  API_URL,
  ENDPOINTS,
  HTTP_METHODS,
  CONTENT_TYPE,
  DEFAULT_POINT_TYPE,
  DEFAULT_CREATE_PRICE,
  MIN_CREATE_PRICE,
  MIN_POINT_PRICE,
  PRICE_STEP,
  OFFER_ID_PREFIX,
  FLATPICKR_DATE_TIME_FORMAT,
  KEYBOARD_KEYS,
  DATE_FORMATS,
  MAX_ROUTE_CITIES,
  SAVE_BUTTON_DEFAULT_TEXT,
  SAVE_BUTTON_SAVING_TEXT,
  DELETE_BUTTON_DEFAULT_TEXT,
  DELETE_BUTTON_DELETING_TEXT,
  CANCEL_BUTTON_TEXT,
  AUTH_TOKEN_RADIX,
  AUTH_TOKEN_START,
  AUTH_TOKEN_END,
  AUTHORIZATION_PREFIX,
  UI_BLOCKER_LOWER_LIMIT,
  UI_BLOCKER_UPPER_LIMIT,
  PAD_LENGTH,
  PAD_FILL,
};
