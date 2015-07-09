import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import TimmaMap from '../widgets/googlemap-widget'

function googleMapComponent(drivers) {
  let props$ = drivers.props.getAll().shareReplay(1);


  let vtree$ = props$.map(({markers: markers, zoomLevel: zoomLevel}) => {
    return new TimmaMap(markers, zoomLevel);
  });

  return {
    DOM: vtree$,
  };
}

module.exports = googleMapComponent;
