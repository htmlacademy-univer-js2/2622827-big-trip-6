import {generatePoint, destinations, offersByType} from '../mock/point.js';
import {generateFilters} from '../mock/filter.js';

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

  updatePoint(updatedPoint) {
    const index = this.points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return;
    }

    this.points[index] = updatedPoint;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType() {
    return this.offersByType;
  }

  getFilters() {
    return generateFilters(this.points);
  }
}

