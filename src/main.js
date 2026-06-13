import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import TripApi from './api/trip-api.js';
import LoadingView from './view/loading-view.js';
import FailedLoadView from './view/failed-load-view.js';
import UiBlocker from './framework/ui-blocker/ui-blocker.js';
import {render, remove} from './framework/render.js';
import {
  API_URL,
  AUTH_TOKEN_RADIX,
  AUTH_TOKEN_START,
  AUTH_TOKEN_END,
  AUTHORIZATION_PREFIX,
  UI_BLOCKER_LOWER_LIMIT,
  UI_BLOCKER_UPPER_LIMIT,
} from './const.js';

const tripMainContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');
newPointButton.disabled = true;

const authorization = `${AUTHORIZATION_PREFIX}${Math.random().toString(AUTH_TOKEN_RADIX).slice(AUTH_TOKEN_START, AUTH_TOKEN_END)}`;
const tripApi = new TripApi(API_URL, authorization);
const pointsModel = new PointsModel({api: tripApi});
const filterModel = new FilterModel();
const uiBlocker = new UiBlocker({
  lowerLimit: UI_BLOCKER_LOWER_LIMIT,
  upperLimit: UI_BLOCKER_UPPER_LIMIT,
});

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsSection,
  pointsModel,
  filterModel,
  newPointButton,
  uiBlocker,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  pointsModel,
  filterModel,
});

const tripInfoPresenter = new TripInfoPresenter({
  tripMainContainer,
  pointsModel,
});

const loadingComponent = new LoadingView();
render(loadingComponent, tripEventsSection);

tripInfoPresenter.init();

const bootstrap = async () => {
  try {
    await pointsModel.init();
    remove(loadingComponent);
    filterPresenter.init();
    boardPresenter.init();
    newPointButton.disabled = false;
  } catch {
    remove(loadingComponent);
    render(new FailedLoadView(), tripEventsSection);
    filterPresenter.init();
  }
};

bootstrap();
