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

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    
    // Форма редактирования должна быть первой в списке
    const editFormView = new EditFormView();
    render(new ListItemView(editFormView), this.pointListComponent.getElement(), RenderPosition.AFTERBEGIN);

    // Точки маршрута - 3 экземпляра
    for (let i = 0; i < 3; i++) {
      const pointView = new PointView();
      render(new ListItemView(pointView), this.pointListComponent.getElement());
    }
  }
}
