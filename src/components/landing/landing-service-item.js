import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function landingServiceItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.landing-service-item', ''),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(serviceType => {

    return h('a', {href: '/map'}, [
      h('img', {"src": serviceType.imageURL}),
      h('a.container', {href: '/map'}, [
        h('h2', serviceType.name),
        h('p', serviceType.description)
      ])
    ]);
  });

  return {
    DOM: vtree$,
    events: {
      clickCustom: intent.click$.withLatestFrom(props$, (ev, {serviceType: serviceType}) => serviceType),
    }
  };
}

module.exports = landingServiceItemComponent;
