import {createElement} from '../render.js';
import {POINT_TYPES} from '../const.js';
import {humanizeEditFormDateTime} from '../utils.js';

const createEventTypeItemsTemplate = (currentType) =>
  POINT_TYPES.map((type) => {
    const id = `event-type-${type}-1`;
    const checkedAttribute = type === currentType ? 'checked' : '';
    const typeLabel = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;

    return (
      `<div class="event__type-item">
        <input id="${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedAttribute}>
        <label class="event__type-label  event__type-label--${type}" for="${id}">${typeLabel}</label>
      </div>`
    );
  }).join('');

const createDestinationOptionsTemplate = (destinations) =>
  destinations.map((destination) =>
    `<option value="${destination.name}"></option>`
  ).join('');

const createOffersSelectorTemplate = (offers, selectedOfferIds) => {
  if (!offers || offers.length === 0) {
    return '';
  }

  return offers.map((offer) => {
    const checkedAttribute = selectedOfferIds.includes(offer.id) ? 'checked' : '';

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checkedAttribute}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join('');
};

const createEditFormTemplate = ({point, destination, offers, destinations}) => {
  const currentType = point.type;
  const typeLabel = `${currentType.charAt(0).toUpperCase()}${currentType.slice(1)}`;
  const destinationName = destination.name;
  const dateFrom = humanizeEditFormDateTime(point.dateFrom);
  const dateTo = humanizeEditFormDateTime(point.dateTo);
  const basePrice = point.basePrice;

  const eventTypeItemsTemplate = createEventTypeItemsTemplate(currentType);
  const destinationOptionsTemplate = createDestinationOptionsTemplate(destinations);
  const offersTemplate = createOffersSelectorTemplate(offers, point.offers);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${eventTypeItemsTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeLabel}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationOptionsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersTemplate}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
        </section>
      </section>
    </form>`
  );
};

export default class EditFormView {
  constructor({point, destination, offers, destinations}) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
    this.destinations = destinations;
  }

  getTemplate() {
    return createEditFormTemplate({
      point: this.point,
      destination: this.destination,
      offers: this.offers,
      destinations: this.destinations,
    });
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

