export default function googleMapDriver() {
  // Observe all todos data and save them to localStorage
  var map = null;
  function initialize() {
    var center = new google.maps.LatLng(60.16, 24.93);
    var mapOptions = {
      center: center,
      zoom: 10
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  }
  google.maps.event.addDomListener(window, 'load', initialize);
  this.markers = function(providerData) {
    if(map == null) return;
    for (var i = 0; i < providerData.length; i++) {
      var provider = providerData[i];
      var myLatLng = new google.maps.LatLng(provider.lastMinuteInfo.lat, provider.lastMinuteInfo.lon);
      var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: provider.lastMinuteInfo.customerName,
          zIndex: 0
      });
    }
  }
  return this;

  }
