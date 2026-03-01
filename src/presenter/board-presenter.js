import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {render, RenderPosition, createElement} from '../render.js';

class ListItemView {
  constructor(contentView) {
    this.contentView = contentView;
  }

  getTemplate() {
    return '<li class="trip-events__item"></li>';
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.element.appendChild(this.contentView.getElement());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export default class BoardPresenter {
  pointListComponent = new PointListView();

  constructor({boardContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const points = this.pointsModel.getPoints();
    const destinations = this.pointsModel.getDestinations();
    const offersByType = this.pointsModel.getOffersByType();

    render(new SortView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);

    const pointForEdit = points[0];
    const destinationForEdit = destinations.find(
      (destination) => destination.id === pointForEdit.destinationId,
    );
    const offersOfTypeForEdit = offersByType.find(
      (offer) => offer.type === pointForEdit.type,
    ).offers;

    const editFormView = new EditFormView({
      point: pointForEdit,
      destination: destinationForEdit,
      offers: offersOfTypeForEdit,
      destinations,
    });

    render(
      new ListItemView(editFormView),
      this.pointListComponent.getElement(),
      RenderPosition.AFTERBEGIN,
    );

    const POINTS_TO_RENDER = 3;

    for (let i = 0; i < Math.min(points.length, POINTS_TO_RENDER); i++) {
      const point = points[i];
      const destination = destinations.find(
        (item) => item.id === point.destinationId,
      );
      const offersOfType = offersByType.find(
        (offer) => offer.type === point.type,
      ).offers;
      const selectedOffers = offersOfType.filter((offer) =>
        point.offers.includes(offer.id),
      );

      const pointView = new PointView({
        point,
        destination,
        offers: selectedOffers,
      });

      render(
        new ListItemView(pointView),
        this.pointListComponent.getElement(),
      );
    }
  }
}

