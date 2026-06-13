import Observable from '../framework/observable.js';
import {FILTER_TYPES, UPDATE_TYPES} from '../const.js';

export default class FilterModel extends Observable {
  #filter = FILTER_TYPES.EVERYTHING;

  getFilter() {
    return this.#filter;
  }

  setFilter(filterType) {
    if (this.#filter === filterType) {
      return;
    }

    this.#filter = filterType;
    this._notify(UPDATE_TYPES.FILTER, this.#filter);
  }
}
