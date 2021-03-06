import {Rx} from '@cycle/core';
import {ENTER_KEY, ESC_KEY} from '../utils';

export default function intent(domDriver) {
  return {
    //mapBoundsChanged$: domDriver.get('#timma-map', 'bounds_changed').map(ev => ev.detail).throttle(500).startWith({bounds: null, zoomLevel: 14, center: null}).shareReplay(1),
    thumbnailClick$: domDriver.get('.list-slot', 'clickCustom').map((ev) => ev.detail).shareReplay(1),
    cityClick$: domDriver.get('.city-item', 'clickCustom').map((ev) => ev.detail).shareReplay(1),
    serviceClick$: domDriver.get('.service-item', 'clickCustom').map((ev) => ev.detail).shareReplay(1)
  };
}
