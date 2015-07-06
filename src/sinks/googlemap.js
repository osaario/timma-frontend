
export default function initalizeMapSink(providerData) {
  // Observe all todos data and save them to localStorage
  function initialize() {
    var provider1 = providerData[0].lastMinuteInfo;
    var center = new google.maps.LatLng(provider1.lat, provider1.lon);
    var mapOptions = {
      center: center,
      zoom: 10
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

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
  initialize();


};

/*
export default function googleMapSink(serviceProviderData) {
  // Observe all todos data and save them to localStorage
  function initalizeMap() {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  };

  let savedTodosData = {
    list: todosData.list.map(todoData =>
      ({
        title: todoData.title,
        completed: todoData.completed,
        id: todoData.id
      })
    )
  };
  localStorage.setItem('todos-cycle', JSON.stringify(savedTodosData))
};
*/
