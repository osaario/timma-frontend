import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function cityItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.city-item', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(({city: city}) => {
    return h('li.list-group-item', [
          h('img.slot-img', {"src":"http://www.noroadsentertainment.com/wp-content/uploads/2015/03/helsinki-finland.jpg" }),
          h('h2', city.city)
    ]);
  });

  return {
    DOM: vtree$,
    events: {
      clickCustom: intent.click$.withLatestFrom(props$, (ev, {city: city}) => city),
    }
  };
}

module.exports = cityItemComponent;
