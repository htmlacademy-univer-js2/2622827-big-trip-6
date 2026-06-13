import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {KEYBOARD_KEYS, DATE_FORMATS, PAD_LENGTH, PAD_FILL} from './const.js';

dayjs.extend(duration);

const padZero = (value) => String(value).padStart(PAD_LENGTH, PAD_FILL);

const isEscapeKey = (evt) =>
  evt.key === KEYBOARD_KEYS.ESCAPE || evt.key === KEYBOARD_KEYS.ESC;

const humanizePointDate = (date) =>
  dayjs(date).format(DATE_FORMATS.POINT_DATE).toUpperCase();

const humanizePointTime = (date) =>
  dayjs(date).format(DATE_FORMATS.POINT_TIME);

const humanizeEditFormDateTime = (date) =>
  dayjs(date).format(DATE_FORMATS.EDIT_FORM);

const getDuration = (dateFrom, dateTo) => {
  const pointDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const days = Math.floor(pointDuration.asDays());
  const hours = pointDuration.hours();
  const minutes = pointDuration.minutes();

  if (days > 0) {
    return `${padZero(days)}D ${padZero(hours)}H ${padZero(minutes)}M`;
  }

  if (hours > 0) {
    return `${padZero(hours)}H ${padZero(minutes)}M`;
  }

  return `${padZero(minutes)}M`;
};

export {
  isEscapeKey,
  humanizePointDate,
  humanizePointTime,
  humanizeEditFormDateTime,
  getDuration,
};
