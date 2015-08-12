import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function landingServiceItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.landing-service-item', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(({serviceType: serviceType}) => {
    return h('.landing-service-item', [
      h('a.thumbnail', [
        h('img', {"src": serviceType.imageUrl})
      ]),
      h('h3', slot[0].serviceType.name)
    ]);
  });

  return {
    DOM: vtree$,
    events: {
      clickCustom: intent.click$.withLatestFrom(props$, (ev, {serviceType: serviceType}) => serviceType),
    }
  };
}

module.exports = listSlotComponent;
