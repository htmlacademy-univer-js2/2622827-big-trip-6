import ApiService from '../framework/api-service.js';
import {adaptToServer} from './adapters/point-adapter.js';
import {ENDPOINTS, HTTP_METHODS, CONTENT_TYPE} from '../const.js';

export default class TripApi extends ApiService {
  getPoints() {
    return this._load({url: ENDPOINTS.POINTS})
      .then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({url: ENDPOINTS.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({url: ENDPOINTS.OFFERS})
      .then(ApiService.parseResponse);
  }

  createPoint(point) {
    const serverPoint = adaptToServer(point);
    delete serverPoint.id;

    return this._load({
      url: ENDPOINTS.POINTS,
      method: HTTP_METHODS.POST,
      body: JSON.stringify(serverPoint),
      headers: new Headers({'Content-Type': CONTENT_TYPE}),
    }).then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `${ENDPOINTS.POINTS}/${point.id}`,
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({'Content-Type': CONTENT_TYPE}),
    }).then(ApiService.parseResponse);
  }

  deletePoint(pointId) {
    return this._load({
      url: `${ENDPOINTS.POINTS}/${pointId}`,
      method: HTTP_METHODS.DELETE,
    });
  }
}
