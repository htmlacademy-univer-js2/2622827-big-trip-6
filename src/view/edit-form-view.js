import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {
  POINT_TYPES,
  MIN_POINT_PRICE,
  PRICE_STEP,
  OFFER_ID_PREFIX,
  FLATPICKR_DATE_TIME_FORMAT,
  SAVE_BUTTON_DEFAULT_TEXT,
  DELETE_BUTTON_DEFAULT_TEXT,
} from '../const.js';
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
    const checkedAttribute = selectedOfferIds.some((id) => String(id) === String(offer.id)) ? 'checked' : '';

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

const createPhotosContainerTemplate = (pictures) => {
  if (!pictures || pictures.length === 0) {
    return '';
  }

  const picturesTemplate = pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ).join('');

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesTemplate}
      </div>
    </div>`
  );
};

const createOffersSectionTemplate = (offers, selectedOfferIds) => {
  const offersTemplate = createOffersSelectorTemplate(offers, selectedOfferIds);

  if (!offersTemplate) {
    return '';
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`
  );
};

const createDestinationSectionTemplate = (destination) => {
  if (!destination) {
    return '';
  }

  const hasDescription = Boolean(destination.description);
  const hasPictures = Boolean(destination.pictures?.length);

  if (!hasDescription && !hasPictures) {
    return '';
  }

  const photosContainerTemplate = createPhotosContainerTemplate(destination.pictures ?? []);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description ?? ''}</p>
      ${photosContainerTemplate}
    </section>`
  );
};

const createEditFormTemplate = ({point, destinations, offersByType}) => {
  const currentType = point.type;
  const typeLabel = `${currentType.charAt(0).toUpperCase()}${currentType.slice(1)}`;
  const destination = destinations.find((item) => item.id === point.destinationId);
  const destinationName = destination?.name ?? '';
  const dateFrom = humanizeEditFormDateTime(point.dateFrom);
  const dateTo = humanizeEditFormDateTime(point.dateTo);
  const basePrice = point.basePrice;
  const offersOfType = offersByType.find((offerItem) => offerItem.type === currentType)?.offers ?? [];

  const eventTypeItemsTemplate = createEventTypeItemsTemplate(currentType);
  const destinationOptionsTemplate = createDestinationOptionsTemplate(destinations);
  const offersSectionTemplate = createOffersSectionTemplate(offersOfType, point.offers);
  const destinationSectionTemplate = createDestinationSectionTemplate(destination);

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1" required>
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" min="${MIN_POINT_PRICE}" step="${PRICE_STEP}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${SAVE_BUTTON_DEFAULT_TEXT}</button>
        <button class="event__reset-btn" type="reset">${DELETE_BUTTON_DEFAULT_TEXT}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersSectionTemplate}
        ${destinationSectionTemplate}
      </section>
    </form>`
  );
};

export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit;
  #handleRollupClick;
  #handleDeleteClick;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor({point, destinations, offersByType, onFormSubmit, onRollupClick, onDeleteClick}) {
    super();
    this._state = EditFormView.parsePointToState(point, destinations, offersByType);
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  static parsePointToState(point, destinations, offersByType) {
    return {
      point,
      destinations,
      offersByType,
    };
  }

  get template() {
    return createEditFormTemplate({
      point: this._state.point,
      destinations: this._state.destinations,
      offersByType: this._state.offersByType,
    });
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationInputHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChangeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
    this.#initDatePickers();
  }

  removeElement() {
    this.#destroyDatePickers();
    super.removeElement();
  }

  #destroyDatePickers() {
    this.#dateFromPicker?.destroy();
    this.#dateToPicker?.destroy();
    this.#dateFromPicker = null;
    this.#dateToPicker = null;
  }

  #initDatePickers() {
    const startInput = this.element.querySelector('#event-start-time-1');
    const endInput = this.element.querySelector('#event-end-time-1');

    this.#dateFromPicker = flatpickr(startInput, {
      dateFormat: FLATPICKR_DATE_TIME_FORMAT,
      defaultDate: this._state.point.dateFrom,
      enableTime: true,
      // eslint-disable-next-line camelcase -- flatpickr option
      time_24hr: true,
      onClose: ([dateFrom]) => {
        this.#handleDateFromChange(dateFrom);
      },
    });

    this.#dateToPicker = flatpickr(endInput, {
      dateFormat: FLATPICKR_DATE_TIME_FORMAT,
      defaultDate: this._state.point.dateTo,
      enableTime: true,
      // eslint-disable-next-line camelcase -- flatpickr option
      time_24hr: true,
      onClose: ([dateTo]) => {
        this.#handleDateToChange(dateTo);
      },
    });
  }

  #handleDateFromChange(dateFrom) {
    if (!dateFrom) {
      return;
    }

    if (dayjs(dateFrom).valueOf() === dayjs(this._state.point.dateFrom).valueOf()) {
      return;
    }

    setTimeout(() => {
      this.updateElement({
        point: {
          ...this._state.point,
          dateFrom,
        },
      });
    });
  }

  #handleDateToChange(dateTo) {
    if (!dateTo) {
      return;
    }

    if (dayjs(dateTo).valueOf() === dayjs(this._state.point.dateTo).valueOf()) {
      return;
    }

    setTimeout(() => {
      this.updateElement({
        point: {
          ...this._state.point,
          dateTo,
        },
      });
    });
  }

  updateElement(update) {
    this.#destroyDatePickers();
    super.updateElement(update);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (!this.#isFormStateValid()) {
      return;
    }

    this.#handleFormSubmit?.(this._state.point);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick?.();
  };

  #typeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__type-input')) {
      return;
    }

    const selectedType = evt.target.value;
    this.updateElement({
      point: {
        ...this._state.point,
        type: selectedType,
        destinationId: null,
        offers: [],
      },
    });
  };

  #destinationInputHandler = (evt) => {
    if (evt.target.value !== '') {
      return;
    }

    if (this._state.point.destinationId === null) {
      return;
    }

    this.updateElement({
      point: {
        ...this._state.point,
        destinationId: null,
      },
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this._state.destinations.find(
      (destination) => destination.name === evt.target.value,
    );

    if (!selectedDestination) {
      if (evt.target.value === '') {
        if (this._state.point.destinationId !== null) {
          this.updateElement({
            point: {
              ...this._state.point,
              destinationId: null,
            },
          });
        }
        return;
      }

      evt.target.value = this.#getDestinationNameById(this._state.point.destinationId);
      return;
    }

    if (selectedDestination.id === this._state.point.destinationId) {
      return;
    }

    this.updateElement({
      point: {
        ...this._state.point,
        destinationId: selectedDestination.id,
      },
    });
  };

  #priceChangeHandler = (evt) => {
    const parsedPrice = Number(evt.target.value);

    if (!Number.isInteger(parsedPrice) || parsedPrice < MIN_POINT_PRICE) {
      evt.target.value = String(this._state.point.basePrice);
      return;
    }

    if (parsedPrice === this._state.point.basePrice) {
      return;
    }

    this._setState({
      point: {
        ...this._state.point,
        basePrice: parsedPrice,
      },
    });
  };

  #offersChangeHandler = () => {
    const selectedOffers = Array.from(
      this.element.querySelectorAll('.event__offer-checkbox:checked'),
    ).map((offerElement) => offerElement.id.replace(OFFER_ID_PREFIX, ''));

    this._setState({
      point: {
        ...this._state.point,
        offers: selectedOffers,
      },
    });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick?.(this._state.point);
  };

  #getDestinationNameById(destinationId) {
    return this._state.destinations.find((destination) => destination.id === destinationId)?.name ?? '';
  }

  #isFormStateValid() {
    const hasDestination = this._state.destinations.some(
      (destination) => destination.id === this._state.point.destinationId,
    );
    const hasValidPrice =
      Number.isInteger(this._state.point.basePrice) && this._state.point.basePrice >= MIN_POINT_PRICE;

    return hasDestination && hasValidPrice;
  }

  setSaveButtonText(text) {
    this.element.querySelector('.event__save-btn').textContent = text;
  }

  setDeleteButtonText(text) {
    this.element.querySelector('.event__reset-btn').textContent = text;
  }
}


