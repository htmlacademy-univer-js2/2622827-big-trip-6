import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_TYPES} from '../const.js';
import {humanizeEditFormDateTime} from '../utils.js';

const createEventTypeItemsTemplate = (currentType) =>
  POINT_TYPES.map((type) => {
    const id = `new-event-type-${type}-1`;
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
        <input class="event__offer-checkbox  visually-hidden" id="new-event-offer-${offer.id}" type="checkbox" name="new-event-offer-${offer.id}" ${checkedAttribute}>
        <label class="event__offer-label" for="new-event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join('');
};

const createPicturesTemplate = (pictures) => {
  if (!pictures || pictures.length === 0) {
    return '';
  }

  return pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ).join('');
};

const createCreateFormTemplate = ({point, destinations, offersByType}) => {
  const currentType = point.type;
  const typeLabel = `${currentType.charAt(0).toUpperCase()}${currentType.slice(1)}`;
  const destination = destinations.find((item) => item.id === point.destinationId);
  const destinationName = destination?.name ?? '';
  const dateFrom = humanizeEditFormDateTime(point.dateFrom);
  const dateTo = humanizeEditFormDateTime(point.dateTo);
  const offersOfType = offersByType.find((offerItem) => offerItem.type === currentType)?.offers ?? [];

  const eventTypeItemsTemplate = createEventTypeItemsTemplate(currentType);
  const destinationOptionsTemplate = createDestinationOptionsTemplate(destinations);
  const offersTemplate = createOffersSelectorTemplate(offersOfType, point.offers);
  const picturesTemplate = createPicturesTemplate(destination?.pictures ?? []);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="new-event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="new-event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypeItemsTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="new-event-destination-1">${typeLabel}</label>
          <input class="event__input  event__input--destination" id="new-event-destination-1" type="text" name="event-destination" value="${destinationName}" list="new-destination-list-1">
          <datalist id="new-destination-list-1">
            ${destinationOptionsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="new-event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="new-event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
          &mdash;
          <label class="visually-hidden" for="new-event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="new-event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="new-event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="new-event-price-1" type="text" name="event-price" value="${point.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
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
          <p class="event__destination-description">${destination?.description ?? ''}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesTemplate}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

const createDefaultPoint = (destinations) => ({
  type: 'flight',
  destinationId: destinations[0].id,
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: '',
  offers: [],
});

export default class CreateFormView extends AbstractStatefulView {
  constructor({destinations, offersByType}) {
    super();
    this._state = {
      point: createDefaultPoint(destinations),
      destinations,
      offersByType,
    };
    this._restoreHandlers();
  }

  get template() {
    return createCreateFormTemplate({
      point: this._state.point,
      destinations: this._state.destinations,
      offersByType: this._state.offersByType,
    });
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
  };

  #typeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__type-input')) {
      return;
    }

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [],
      },
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this._state.destinations.find(
      (destination) => destination.name === evt.target.value,
    );

    if (!selectedDestination) {
      return;
    }

    this.updateElement({
      point: {
        ...this._state.point,
        destinationId: selectedDestination.id,
      },
    });
  };
}
