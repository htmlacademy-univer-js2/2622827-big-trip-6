const HUMANIZE_MONTH_OPTIONS = { month: 'short', day: '2-digit' };
const HUMANIZE_TIME_OPTIONS = { hour: '2-digit', minute: '2-digit' };

const padZero = (value) => String(value).padStart(2, '0');

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

const humanizePointDate = (date) =>
  date.toLocaleString('en-US', HUMANIZE_MONTH_OPTIONS).toUpperCase();

const humanizePointTime = (date) =>
  date.toLocaleString('en-GB', HUMANIZE_TIME_OPTIONS);

const humanizeEditFormDateTime = (date) => {
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(-2);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getDuration = (dateFrom, dateTo) => {
  const diffInMs = dateTo.getTime() - dateFrom.getTime();
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

