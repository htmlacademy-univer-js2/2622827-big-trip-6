import {POINT_TYPES} from '../const.js';
import {getRandomInteger, getRandomArrayElement} from '../utils.js';

const CITIES = ['Amsterdam', 'Geneva', 'Chamonix'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const generateDescription = () => {
  const sentenceCount = getRandomInteger(1, 5);
  const sentences = new Set();

  while (sentences.size < sentenceCount) {
    sentences.add(getRandomArrayElement(DESCRIPTIONS));
  }

  return Array.from(sentences).join(' ');
};

const generatePictures = () => {
  const pictureCount = getRandomInteger(1, 5);

  return Array.from({length: pictureCount}, () => ({
    src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 1000)}`,
    description: 'Event photo',
  }));
};

const destinations = CITIES.map((city, index) => ({
  id: index + 1,
  name: city,
  description: generateDescription(),
  pictures: generatePictures(),
}));

const OFFERS_TITLES = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train',
];

const offersByType = POINT_TYPES.map((type) => ({
  type,
  offers: OFFERS_TITLES.map((title, index) => ({
    id: index + 1,
    title,
    price: getRandomInteger(10, 100),
  })),
}));

let pointId = 1;

const generateDate = () => {
  const daysGap = getRandomInteger(-3, 3);
  const date = new Date();
  date.setDate(date.getDate() + daysGap);
  date.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59), 0, 0);
  return date;
};

const generatePoint = () => {
  const type = getRandomArrayElement(POINT_TYPES);
  const destination = getRandomArrayElement(destinations);
  const dateFrom = generateDate();
  const dateTo = new Date(dateFrom.getTime() + getRandomInteger(30, 300) * 60 * 1000);
  const basePrice = getRandomInteger(10, 500);

  const offersOfType = offersByType.find((offer) => offer.type === type).offers;
  const selectedOffersCount = getRandomInteger(0, offersOfType.length);
  const selectedOffers = offersOfType
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, selectedOffersCount)
    .map((offer) => offer.id);

  const point = {
    id: pointId,
    type,
    destinationId: destination.id,
    dateFrom,
    dateTo,
    basePrice,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: selectedOffers,
  };

  pointId += 1;

  return point;
};

export {generatePoint, destinations, offersByType};

