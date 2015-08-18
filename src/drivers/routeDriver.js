import {Rx} from '@cycle/core';

export function makeRouteDriver(initialRoute) {
  let subject = new Rx.BehaviorSubject(initialRoute);
  window.history.pushState(null, '', initialRoute);
  return function routeDriver(routeOut$) {
    routeOut$.subscribe(routeOut => {
        window.history.pushState(null, '', routeOut);
        subject.onNext(routeOut);
    });
    return subject.distinctUntilChanged();
  };
}
