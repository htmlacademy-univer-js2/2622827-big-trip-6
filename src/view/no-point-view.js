import AbstractView from '../framework/view/abstract-view.js';
import {EMPTY_LIST_MESSAGE} from '../const.js';

const createNoPointTemplate = () =>
  `<p class="trip-events__msg">${EMPTY_LIST_MESSAGE}</p>`;

export default class NoPointView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
}
