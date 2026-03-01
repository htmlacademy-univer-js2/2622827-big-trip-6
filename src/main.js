import FilterView from './view/filter-view.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({boardContainer: tripEventsSection});

render(new FilterView(), filtersContainer);

boardPresenter.init();
