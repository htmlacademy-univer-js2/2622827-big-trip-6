import {adaptToApp} from '../api/adapters/point-adapter.js';
import Observable from '../framework/observable.js';
import {
  UPDATE_TYPES,
  FAILED_LOAD_POINTS_MESSAGE,
  FAILED_LOAD_DESTINATIONS_MESSAGE,
  FAILED_LOAD_OFFERS_MESSAGE,
} from '../const.js';

export default class PointsModel extends Observable {
  #api = null;

  constructor({api}) {
    super();
    this.#api = api;
    this.points = [];
    this.destinations = [];
    this.offersByType = [];
  }

  async init() {
    try {
      const points = await this.#api.getPoints();
      this.points = Array.isArray(points) ? points.map(adaptToApp) : [];
    } catch {
      this.points = [];
      throw new Error(FAILED_LOAD_POINTS_MESSAGE);
    }

    try {
      const destinations = await this.#api.getDestinations();
      this.destinations = Array.isArray(destinations) ? destinations : [];
    } catch {
      this.destinations = [];
      throw new Error(FAILED_LOAD_DESTINATIONS_MESSAGE);
    }

    try {
      const offers = await this.#api.getOffers();
      this.offersByType = Array.isArray(offers) ? offers : [];
    } catch {
      this.offersByType = [];
      throw new Error(FAILED_LOAD_OFFERS_MESSAGE);
    }

    this._notify(UPDATE_TYPES.POINTS_LIST, this.getPoints());
  }

  getPoints() {
    return this.points.slice();
  }

  setPoints(points) {
    this.points = points.slice();
    this._notify(UPDATE_TYPES.POINTS_LIST, this.getPoints());
  }

  async updatePoint(pointId, updatedPoint) {
    const index = this.points.findIndex((point) => point.id === pointId);

    if (index === -1) {
      return null;
    }

    const serverPoint = await this.#api.updatePoint(updatedPoint);
    const appPoint = adaptToApp(serverPoint);

    const updatedPoints = this.getPoints();
    updatedPoints[index] = appPoint;
    this.setPoints(updatedPoints);

    return appPoint;
  }

  async addPoint(newPoint) {
    const serverPoint = await this.#api.createPoint(newPoint);
    const appPoint = adaptToApp(serverPoint);
    this.setPoints([...this.getPoints(), appPoint]);

    return appPoint;
  }

  async deletePoint(pointId) {
    const points = this.getPoints();
    const index = points.findIndex((point) => point.id === pointId);

    if (index === -1) {
      return null;
    }

    await this.#api.deletePoint(pointId);
    points.splice(index, 1);
    this.setPoints(points);

    return pointId;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType() {
    return this.offersByType;
  }
}
