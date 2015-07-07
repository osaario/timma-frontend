import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import TimmaMap from '../widgets/googlemap-widget'

function googleMapComponent(drivers) {
  let intent = {
    bounds$: drivers.DOM.get('timma-map', 'bounds_changed'),
  };

  const defaultProps = {markers: []};
  let props$ = drivers.props.getAll().startWith(defaultProps).shareReplay(1);


  let vtree$ = props$.map(({markers: markers}) => {
    return new TimmaMap(markers);
  });

  return {
    DOM: vtree$,
    events: {
      bounds: intent.bounds$
    }
  };
}

module.exports = googleMapComponent;