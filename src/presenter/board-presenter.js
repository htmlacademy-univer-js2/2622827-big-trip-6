import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import CreateFormView from '../view/create-form-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {render} from '../framework/render.js';
import {SORT_TYPES} from '../const.js';

export default class BoardPresenter {
  pointListComponent = new PointListView();
  #sortComponent = null;
  #pointPresenters = [];
  #currentSortType = SORT_TYPES.DAY;
  #pointsToRender = 5;

  constructor({boardContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const points = this.pointsModel.getPoints();
    const destinations = this.pointsModel.getDestinations();
    const offersByType = this.pointsModel.getOffersByType();

    if (points.length === 0) {
      render(new NoPointView(), this.boardContainer);
      return;
    }

    this.#sortComponent = new SortView();
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.boardContainer);
    render(new CreateFormView({destinations, offersByType}), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    this.#renderPoints(points, destinations, offersByType);
  }

  #renderPoints(points, destinations, offersByType) {
    const sortedPoints = this.#getSortedPoints(points);

    for (let i = 0; i < Math.min(sortedPoints.length, this.#pointsToRender); i++) {
      const pointPresenter = new PointPresenter({
        pointListContainer: this.pointListComponent.element,
        point: sortedPoints[i],
        destinations,
        offersByType,
        onPointChange: this.#handlePointChange,
        onBeforeEdit: this.#resetAllPointViewsToDefault,
      });
      pointPresenter.init();
      this.#pointPresenters.push(pointPresenter);
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.pointsModel.updatePoint(updatedPoint);

    if (this.#currentSortType === SORT_TYPES.DAY) {
      const presenter = this.#pointPresenters.find(
        (item) => item.pointId === updatedPoint.id,
      );
      presenter?.update(updatedPoint);
      return;
    }

    this.#clearPointList();
    this.#renderPoints(
      this.pointsModel.getPoints(),
      this.pointsModel.getDestinations(),
      this.pointsModel.getOffersByType(),
    );
  };

  #resetAllPointViewsToDefault = () => {
    for (const presenter of this.#pointPresenters) {
      presenter.resetView();
    }
  };

  #clearPointList() {
    for (const presenter of this.#pointPresenters) {
      presenter.destroy();
    }
    this.#pointPresenters = [];
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints(
      this.pointsModel.getPoints(),
      this.pointsModel.getDestinations(),
      this.pointsModel.getOffersByType(),
    );
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
