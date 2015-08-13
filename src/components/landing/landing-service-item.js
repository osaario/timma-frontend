import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function landingServiceItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.landing-service-item', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(serviceType => {

    return h('div', [
      h('img', {"src": serviceType.imageURL}),
      h('div.container', [
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
