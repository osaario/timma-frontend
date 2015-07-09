import {Rx} from '@cycle/core';
import {ENTER_KEY, ESC_KEY} from '../utils';

export default function intent(domDriver) {
  return {
    mapBoundsChanged$: domDriver.get('#timma-map', 'bounds_changed').throttle(1000).startWith(null).shareReplay(1),
    mapZoomChanged$: domDriver.get('#timma-map', 'zoom_changed').throttle(1000).startWith(null).shareReplay(1),
    thumbnailClick$: domDriver.get('.list-slot', 'clickCustom').map((ev) => ev.detail).shareReplay(1),
    serviceClick$: domDriver.get('.service-item', 'clickCustom').map((ev) => ev.detail).shareReplay(1)
  };
};
