import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {render, replace} from '../framework/render.js';

export default class PointPresenter {
  #pointListContainer = null;
  #point = null;
  #destinations = null;
  #offersByType = null;
  #onPointChange = null;
  #onBeforeEdit = null;

  #pointComponent = null;
  #editFormComponent = null;
  #isPointMode = true;

  constructor({
    pointListContainer,
    point,
    destinations,
    offersByType,
    onPointChange,
    onBeforeEdit,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#onPointChange = onPointChange;
    this.#onBeforeEdit = onBeforeEdit;
  }

  get pointId() {
    return this.#point.id;
  }

  init() {
    this.#renderPoint();
    render(this.#pointComponent, this.#pointListContainer);
  }

  #getDestination() {
    return this.#destinations.find(
      (item) => item.id === this.#point.destinationId,
    );
  }

  #getSelectedOffers() {
    const offersOfType = this.#offersByType.find(
      (offer) => offer.type === this.#point.type,
    ).offers;

    return offersOfType.filter((offer) =>
      this.#point.offers.includes(offer.id),
    );
  }

  #getAllOffersOfType() {
    return this.#offersByType.find(
      (offer) => offer.type === this.#point.type,
    ).offers;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    this.#onBeforeEdit();
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#isPointMode = false;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isPointMode = true;
  };

  #handleFavoriteClick = (updatedPoint) => {
    this.#onPointChange(updatedPoint);
  };

  #createPointComponent() {
    const destination = this.#getDestination();
    const selectedOffers = this.#getSelectedOffers();

    return new PointView({
      point: this.#point,
      destination,
      offers: selectedOffers,
      onEditClick: this.#replacePointToForm,
      onFavoriteClick: this.#handleFavoriteClick,
    });
  }

  #createEditFormComponent() {
    const destination = this.#getDestination();
    const offersOfType = this.#getAllOffersOfType();

    return new EditFormView({
      point: this.#point,
      destination,
      offers: offersOfType,
      destinations: this.#destinations,
      onFormSubmit: this.#replaceFormToPoint,
      onRollupClick: this.#replaceFormToPoint,
    });
  }

  #renderPoint() {
    this.#pointComponent = this.#createPointComponent();
    this.#editFormComponent = this.#createEditFormComponent();
  }

  resetView() {
    if (this.#isPointMode) {
      return;
    }

    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isPointMode = true;
  }

  update(updatedPoint) {
    this.#point = updatedPoint;

    if (!this.#isPointMode) {
      const oldEditForm = this.#editFormComponent;
      this.#editFormComponent = this.#createEditFormComponent();
      replace(this.#editFormComponent, oldEditForm);
      this.#pointComponent = this.#createPointComponent();
      return;
    }

    const oldPointComponent = this.#pointComponent;
    this.#pointComponent = this.#createPointComponent();
    replace(this.#pointComponent, oldPointComponent);
    this.#editFormComponent = this.#createEditFormComponent();
  }
}
