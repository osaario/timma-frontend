import {Rx} from '@cycle/core';
import {ENTER_KEY, ESC_KEY} from '../utils';

export default function intent(domDriver) {
  return {
    mapBoundsChanged$: domDriver.get('#timma-map', 'bounds_changed').startWith(null).shareReplay(1),
    thumbnailClick$: domDriver.get('.list-slot', 'clickCustom').map((ev) => ev.detail).shareReplay(1)
  };
};
