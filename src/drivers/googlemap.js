import {Rx} from '@cycle/core';

export default function googleMapDriver() {
  // Observe all todos data and save them to localStorage
  var map$ = new Rx.ReplaySubject(1);
    function initialize() {
      var center = new google.maps.LatLng(60.16, 24.93);
      var mapOptions = {
        center: center,
        zoom: 10
      };
      var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
      map$.onNext(map);
    }
   this.bounds$ = map$.flatMap(function(gMap) {
     return Rx.Observable.create(function(observer) {
      google.maps.event.addListener(gMap, 'bounds_changed', function() {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        var bounds = gMap.getBounds();
        observer.onNext(bounds);
      });

     });
   });
  google.maps.event.addDomListener(window, 'load', initialize);
  this.markers = function(providerData$) {
    var pairObs = map$.combineLatest(providerData$, (gMap, providerData) => {
      return {map: gMap, providers: providerData};
    });
    pairObs.subscribe((pair) => {
      for (var i = 0; i < pair.providers.length; i++) {
        var provider = pair.providers[i];
        var myLatLng = new google.maps.LatLng(provider.lastMinuteInfo.lat, provider.lastMinuteInfo.lon);
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: pair.map,
          title: provider.lastMinuteInfo.customerName,
          zIndex: 0
        });
      }
    });
  }
  return this;

  }
