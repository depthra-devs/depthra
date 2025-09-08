
function get_coords(tryls = false, putls = false, callback = function(coords, status) {console.log(coords, status)}) {
    if (tryls) {
        const coords = localStorage.getItem("geocoords")
        if (coords) {
            callback(JSON.parse(coords), 1)
            return
        }
    }
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = [position.coords.latitude, position.coords.longitude]
            if (putls) {
                localStorage.setItem("geocoords", JSON.stringify(coords))
            }
            callback(coords, 1)
        })
    }
    else {
        callback([], 0)
    }
}

function get_address(latitude, longtitude, callback = function(address, status) {console.log(address, status)}) {
    fetch(`http://localhost:3000/app/utils/locationdat?lat=${latitude}&lon=${longtitude}`)
    .then(function(res) {
        return res.json()
    })
    .then(address => {
        callback(address, 1)
    })
    .catch(err => {
        callback(err, -1)
    })
}


//assuming leaflet.js is loaded

function get_map(display_element_id) {
    var map = L.map("map").setView([20.5937, 78.9629], 5)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 19}).addTo(map)
    return map
}

function add_marker_on_map(coords, map) {
    var marker = L.marker(coords).addTo(map)
    return marker
}

function remove_marker_on_map(map, marker) {
    map.removeLayer(marker)
}

function set_map_markevent(map, callback = function(coords) {console.log(coords)}) {
    map.on("click", function(event) {
        const {lat, lng} = event.latlng
        callback([lat, lng])
    })
}
