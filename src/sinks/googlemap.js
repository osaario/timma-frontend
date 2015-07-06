
export default function initalizeMapSink(serviceProviderData) {
  // Observe all todos data and save them to localStorage
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
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
