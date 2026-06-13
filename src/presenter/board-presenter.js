import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import CreateFormView from '../view/create-form-view.js';
import PointPresenter from './point-presenter.js';
import {remove, render} from '../framework/render.js';
import {FILTER_TYPES, SORT_TYPES, USER_ACTIONS, UPDATE_TYPES, SAVE_BUTTON_DEFAULT_TEXT, SAVE_BUTTON_SAVING_TEXT} from '../const.js';
import {isEscapeKey} from '../utils.js';
import {filter} from '../utils/filter.js';

export default class BoardPresenter {
  pointListComponent = new PointListView();
  #sortComponent = null;
  #noPointComponent = null;
  #createFormComponent = null;
  #createFormListItem = null;
  #pointPresenters = [];
  #currentSortType = SORT_TYPES.DAY;

  constructor({boardContainer, pointsModel, filterModel, newPointButton, uiBlocker}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.filterModel = filterModel;
    this.newPointButton = newPointButton;
    this.uiBlocker = uiBlocker;
  }

  init() {
    this.pointsModel.addObserver(this.#handleModelEvent);
    this.filterModel.addObserver(this.#handleModelEvent);
    this.newPointButton.addEventListener('click', this.#handleNewPointButtonClick);
    this.#renderBoard();
  }

  get points() {
    const filterType = this.filterModel.getFilter();
    const points = this.pointsModel.getPoints();
    return filter[filterType](points);
  }

  #renderBoard() {
    const points = this.points;
    const destinations = this.pointsModel.getDestinations();
    const offersByType = this.pointsModel.getOffersByType();

    this.#clearBoard();

    if (points.length === 0) {
      this.#noPointComponent = new NoPointView({
        filterType: this.filterModel.getFilter(),
      });
      render(this.#noPointComponent, this.boardContainer);
      return;
    }

    this.#sortComponent = new SortView();
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    this.#renderPoints(points, destinations, offersByType);
  }

  #renderPoints(points, destinations, offersByType) {
    const sortedPoints = this.#getSortedPoints(points);

    for (let i = 0; i < sortedPoints.length; i++) {
      const pointPresenter = new PointPresenter({
        pointListContainer: this.pointListComponent.element,
        point: sortedPoints[i],
        destinations,
        offersByType,
        onPointChange: this.#handlePointChange,
        onBeforeEdit: this.#handleBeforeEdit,
        uiBlocker: this.uiBlocker,
      });
      pointPresenter.init();
      this.#pointPresenters.push(pointPresenter);
    }
  }

  #handlePointChange = async (actionType, updatedPoint) => {
    switch (actionType) {
      case USER_ACTIONS.UPDATE_POINT:
        await this.pointsModel.updatePoint(updatedPoint.id, updatedPoint);
        break;
      case USER_ACTIONS.ADD_POINT:
        await this.pointsModel.addPoint(updatedPoint);
        this.#destroyCreateForm();
        break;
      case USER_ACTIONS.DELETE_POINT:
        await this.pointsModel.deletePoint(updatedPoint.id);
        break;
      default:
        break;
    }
  };

  #resetAllPointViewsToDefault = () => {
    for (const presenter of this.#pointPresenters) {
      presenter.resetView();
    }
  };

  #handleBeforeEdit = () => {
    this.#resetAllPointViewsToDefault();
    this.#destroyCreateForm();
  };

  #clearPointList() {
    for (const presenter of this.#pointPresenters) {
      presenter.destroy();
    }
    this.#pointPresenters = [];
  }

  #clearBoard() {
    this.#clearPointList();
    remove(this.#sortComponent);
    this.#sortComponent = null;
    remove(this.#noPointComponent);
    this.#noPointComponent = null;
    remove(this.pointListComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#resetAllPointViewsToDefault();
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints(
      this.points,
      this.pointsModel.getDestinations(),
      this.pointsModel.getOffersByType(),
    );
  };

  #handleModelEvent = (event) => {
    if (event === UPDATE_TYPES.FILTER) {
      this.#currentSortType = SORT_TYPES.DAY;
    }

    this.#destroyCreateForm();
    this.#renderBoard();
  };

  #createPoint = () => {
    this.filterModel.setFilter(FILTER_TYPES.EVERYTHING);
    this.#currentSortType = SORT_TYPES.DAY;
    this.#resetAllPointViewsToDefault();
    this.#destroyCreateForm();

    this.#createFormComponent = new CreateFormView({
      destinations: this.pointsModel.getDestinations(),
      offersByType: this.pointsModel.getOffersByType(),
      onFormSubmit: this.#handleCreateFormSubmit,
      onCancelClick: this.#destroyCreateForm,
    });

    remove(this.#noPointComponent);
    this.#noPointComponent = null;

    if (!this.pointListComponent.element.parentElement) {
      render(this.pointListComponent, this.boardContainer);
    }

    this.#createFormListItem = document.createElement('li');
    this.#createFormListItem.classList.add('trip-events__item');
    this.pointListComponent.element.prepend(this.#createFormListItem);
    render(this.#createFormComponent, this.#createFormListItem);
    document.addEventListener('keydown', this.#escKeyDownHandler, true);
    this.newPointButton.disabled = true;
  };

  #destroyCreateForm = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler, true);

    if (this.#createFormComponent !== null) {
      remove(this.#createFormComponent);
      this.#createFormComponent = null;
    }

    this.#createFormListItem?.remove();
    this.#createFormListItem = null;
    this.newPointButton.disabled = false;
  };

  #handleCreateFormSubmit = async (newPoint) => {
    const createForm = this.#createFormComponent;
    createForm.setSaveButtonText(SAVE_BUTTON_SAVING_TEXT);
    this.uiBlocker.block();

    try {
      await this.#handlePointChange(USER_ACTIONS.ADD_POINT, newPoint);
    } catch {
      createForm.shake();
    } finally {
      createForm.setSaveButtonText(SAVE_BUTTON_DEFAULT_TEXT);
      this.uiBlocker.unblock();
    }
  };

  #handleNewPointButtonClick = (evt) => {
    evt.preventDefault();
    this.#createPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#destroyCreateForm();
    }
  };

  #getSortedPoints(points) {
    const pointsCopy = points.slice();

    switch (this.#currentSortType) {
      case SORT_TYPES.TIME:
        return pointsCopy.sort((pointA, pointB) => {
          const durationA = pointA.dateTo.getTime() - pointA.dateFrom.getTime();
          const durationB = pointB.dateTo.getTime() - pointB.dateFrom.getTime();
          return durationB - durationA;
        });
      case SORT_TYPES.PRICE:
        return pointsCopy.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
      case SORT_TYPES.DAY:
      default:
        return pointsCopy.sort((pointA, pointB) => pointA.dateFrom - pointB.dateFrom);
    }
  }
}
