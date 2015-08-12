import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function landingServiceItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.landing-service-item', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(serviceType => {
    return h('div.container', [
      h('img', {"src": serviceType.imageURL}),
      h('h3', serviceType.name)
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
