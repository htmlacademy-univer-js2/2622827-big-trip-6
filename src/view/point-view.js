import {createElement} from '../render.js';
import {
  humanizePointDate,
  humanizePointTime,
  getDuration,
} from '../utils.js';

const createOffersTemplate = (offers) => {
  if (!offers || offers.length === 0) {
    return '';
  }

  const offersTemplate = offers.map((offer) => (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  )).join('');

  return (
    `<h4 class="visually-hidden">Offers:</h4>
     <ul class="event__selected-offers">
       ${offersTemplate}
     </ul>`
  );
};

const createPointTemplate = (point, destination, offers) => {
  const dateFrom = point.dateFrom;
  const dateTo = point.dateTo;

  const date = humanizePointDate(dateFrom);
  const timeFrom = humanizePointTime(dateFrom);
  const timeTo = humanizePointTime(dateTo);
  const duration = getDuration(dateFrom, dateTo);

  const favoriteClassName = point.isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const typeCapitalized = `${point.type.charAt(0).toUpperCase()}${point.type.slice(1)}`;
  const title = `${typeCapitalized} ${destination.name}`;
  const offersTemplate = createOffersTemplate(offers);

  return (
    `<div class="event">
      <time class="event__date" datetime="${dateFrom.toISOString()}">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${title}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom.toISOString()}">${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo.toISOString()}">${timeTo}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      ${offersTemplate}
      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class PointView {
  constructor({point, destination, offers}) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createPointTemplate(this.point, this.destination, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

