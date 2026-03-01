import {generatePoint, destinations, offersByType} from '../mock/point.js';

const POINT_COUNT = 5;

export default class PointsModel {
  constructor() {
    this.points = Array.from({length: POINT_COUNT}, generatePoint);
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType() {
    return this.offersByType;
  }
}

