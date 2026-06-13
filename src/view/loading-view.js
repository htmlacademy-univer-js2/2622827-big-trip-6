import AbstractView from '../framework/view/abstract-view.js';
import {LOADING_MESSAGE} from '../const.js';

const createLoadingTemplate = () =>
  `<p class="trip-events__msg">${LOADING_MESSAGE}</p>`;

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
