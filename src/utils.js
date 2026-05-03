import dayjs from 'dayjs';

const padZero = (value) => String(value).padStart(2, '0');

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

const humanizePointDate = (date) =>
  dayjs(date).format('MMM DD').toUpperCase();

const humanizePointTime = (date) =>
  dayjs(date).format('HH:mm');

const humanizeEditFormDateTime = (date) =>
  dayjs(date).format('DD/MM/YY HH:mm');

const getDuration = (dateFrom, dateTo) => {
  const diffInMs = dayjs(dateTo).diff(dayjs(dateFrom));
  const diffInMinutesTotal = Math.floor(diffInMs / 60000);

  const days = Math.floor(diffInMinutesTotal / (60 * 24));
  const hours = Math.floor((diffInMinutesTotal % (60 * 24)) / 60);
  const minutes = diffInMinutesTotal % 60;

  if (days > 0) {
    return `${padZero(days)}D ${padZero(hours)}H ${padZero(minutes)}M`;
  }

  if (hours > 0) {
    return `${padZero(hours)}H ${padZero(minutes)}M`;
  }

  return `${padZero(minutes)}M`;
};

export {
  getRandomInteger,
  getRandomArrayElement,
  humanizePointDate,
  humanizePointTime,
  humanizeEditFormDateTime,
  getDuration,
};
