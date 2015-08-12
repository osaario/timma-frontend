import {Rx} from '@cycle/core';

export default function intent(domDriver) {
  return {
    serviceClick$: domDriver.get('.landing-service-item', 'clickCustom').map((ev) => ev.detail).shareReplay(1)
  };
}
