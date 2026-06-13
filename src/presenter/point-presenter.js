import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {render, replace, remove} from '../framework/render.js';
import {SHAKE_CLASS_NAME, SHAKE_ANIMATION_TIMEOUT} from '../framework/view/abstract-view.js';
import {
  USER_ACTIONS,
  SAVE_BUTTON_DEFAULT_TEXT,
  SAVE_BUTTON_SAVING_TEXT,
  DELETE_BUTTON_DEFAULT_TEXT,
  DELETE_BUTTON_DELETING_TEXT,
} from '../const.js';
import {isEscapeKey} from '../utils.js';

export default class PointPresenter {
  #pointListContainer = null;
  #point = null;
  #destinations = null;
  #offersByType = null;
  #onPointChange = null;
  #onBeforeEdit = null;
  #uiBlocker = null;

  #pointComponent = null;
  #editFormComponent = null;
  #listItemElement = null;
  #isPointMode = true;

  constructor({
    pointListContainer,
    point,
    destinations,
    offersByType,
    onPointChange,
    onBeforeEdit,
    uiBlocker,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#onPointChange = onPointChange;
    this.#onBeforeEdit = onBeforeEdit;
    this.#uiBlocker = uiBlocker;
  }

  init() {
    this.#renderPoint();
    this.#listItemElement = document.createElement('li');
    this.#listItemElement.classList.add('trip-events__item');
    this.#pointListContainer.append(this.#listItemElement);
    render(this.#pointComponent, this.#listItemElement);
  }

  #getDestination() {
    return this.#destinations.find(
      (item) => item.id === this.#point.destinationId,
    );
  }

  #getSelectedOffers() {
    const offersOfType = this.#offersByType.find(
      (offer) => offer.type === this.#point.type,
    )?.offers ?? [];

    return offersOfType.filter((offer) =>
      this.#point.offers.includes(offer.id),
    );
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#editFormComponent?.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
      this.#editFormComponent?.setDeleteButtonText(DELETE_BUTTON_DEFAULT_TEXT);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    this.#onBeforeEdit();
    this.#editFormComponent = this.#createEditFormComponent();
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler, true);
    this.#isPointMode = false;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler, true);
    this.#editFormComponent = null;
    this.#isPointMode = true;
  };

  #shakeListItem() {
    this.#listItemElement.classList.add(SHAKE_CLASS_NAME);

    setTimeout(() => {
      this.#listItemElement.classList.remove(SHAKE_CLASS_NAME);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  #handleFormSubmit = async (updatedPoint) => {
    const editForm = this.#editFormComponent;
    editForm.setSaveButtonText(SAVE_BUTTON_SAVING_TEXT);
    this.#uiBlocker.block();

    try {
      await this.#onPointChange(USER_ACTIONS.UPDATE_POINT, updatedPoint);
      editForm.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
      this.#replaceFormToPoint();
    } catch {
      editForm.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
      editForm.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = async (updatedPoint) => {
    this.#uiBlocker.block();

    try {
      await this.#onPointChange(USER_ACTIONS.UPDATE_POINT, updatedPoint);
    } catch {
      this.#shakeListItem();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleDeleteClick = async (point) => {
    const editForm = this.#editFormComponent;
    editForm.setDeleteButtonText(DELETE_BUTTON_DELETING_TEXT);
    this.#uiBlocker.block();

    try {
      await this.#onPointChange(USER_ACTIONS.DELETE_POINT, point);
    } catch {
      editForm.setDeleteButtonText(DELETE_BUTTON_DEFAULT_TEXT);
      editForm.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
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
    return new EditFormView({
      point: this.#point,
      destinations: this.#destinations,
      offersByType: this.#offersByType,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onDeleteClick: this.#handleDeleteClick,
    });
  }

  #renderPoint() {
    this.#pointComponent = this.#createPointComponent();
  }

  resetView() {
    if (this.#isPointMode) {
      return;
    }

    this.#editFormComponent?.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
    this.#editFormComponent?.setDeleteButtonText(DELETE_BUTTON_DEFAULT_TEXT);
    this.#replaceFormToPoint();
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeyDownHandler, true);
    remove(this.#pointComponent);

    if (this.#editFormComponent !== null) {
      remove(this.#editFormComponent);
      this.#editFormComponent = null;
    }

    this.#listItemElement?.remove();
  }
}
