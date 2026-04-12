import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import CreateFormView from '../view/create-form-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {render} from '../framework/render.js';

export default class BoardPresenter {
  pointListComponent = new PointListView();
  #pointPresenters = [];

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

    render(new SortView(), this.boardContainer);
    render(new CreateFormView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);

    const POINTS_TO_RENDER = 5;

    for (let i = 0; i < Math.min(points.length, POINTS_TO_RENDER); i++) {
      const pointPresenter = new PointPresenter({
        pointListContainer: this.pointListComponent.element,
        point: points[i],
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
    const presenter = this.#pointPresenters.find(
      (item) => item.pointId === updatedPoint.id,
    );
    presenter?.update(updatedPoint);
  };

  #resetAllPointViewsToDefault = () => {
    for (const presenter of this.#pointPresenters) {
      presenter.resetView();
    }
  };
}
