let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40, lng: 100 },
        zoom: 8,
    });
}

function createMap(latitude, longitude) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parseInt(latitude), lng: parseInt(longitude) },
        zoom: 8,
    });
}
