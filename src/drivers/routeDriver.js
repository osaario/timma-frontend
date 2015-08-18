import {Rx} from '@cycle/core';

export function makeRouteDriver(initialRoute) {
  if (typeof window !== 'undefined') {
    window.history.pushState(null, '', initialRoute);
  }
  return function routeDriver(routeOut$) {
    routeOut$.subscribe(routeOut => {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', routeOut);
      }
    });
    return Rx.Observable.just(window.location.href);
  };
}
