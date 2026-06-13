import dayjs from 'dayjs';
import {DATE_FORMATS, MAX_ROUTE_CITIES} from '../const.js';

const getRouteTitle = (points, destinations) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort((pointA, pointB) => pointA.dateFrom - pointB.dateFrom);
  const cityNames = [];

  sortedPoints.forEach((point) => {
    const destination = destinations.find(
      (item) => String(item.id) === String(point.destinationId),
    );

    if (destination && !cityNames.includes(destination.name)) {
      cityNames.push(destination.name);
    }
  });

  if (cityNames.length === 0) {
    return '';
  }

  if (cityNames.length <= MAX_ROUTE_CITIES) {
    return cityNames.join(' &mdash; ');
  }

  return `${cityNames[0]} &mdash; ... &mdash; ${cityNames[cityNames.length - 1]}`;
};

const getTripDates = (points) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort((pointA, pointB) => pointA.dateFrom - pointB.dateFrom);
  const dateFrom = sortedPoints[0].dateFrom;
  const dateTo = sortedPoints[sortedPoints.length - 1].dateTo;
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  if (from.format(DATE_FORMATS.TRIP_MONTH) === to.format(DATE_FORMATS.TRIP_MONTH)) {
    return `${from.format(DATE_FORMATS.TRIP_DAY)}&nbsp;&mdash;&nbsp;${to.format(DATE_FORMATS.TRIP_DAY_MONTH)}`;
  }

  return `${from.format(DATE_FORMATS.TRIP_DAY_MONTH)}&nbsp;&mdash;&nbsp;${to.format(DATE_FORMATS.TRIP_DAY_MONTH)}`;
};

const getOffersPrice = (point, offersByType) => {
  const offersOfType = offersByType.find((offer) => offer.type === point.type)?.offers ?? [];

  return offersOfType
    .filter((offer) => point.offers.some((id) => String(id) === String(offer.id)))
    .reduce((total, offer) => total + offer.price, 0);
};

const getTripTotalCost = (points, offersByType) =>
  points.reduce((total, point) => total + point.basePrice + getOffersPrice(point, offersByType), 0);

export {getRouteTitle, getTripDates, getTripTotalCost};
