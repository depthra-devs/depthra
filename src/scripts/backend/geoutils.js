
function get_coords(tryls = false, putls = false, callback = function(coords, status) {console.log(coords, status)}) {
    if (tryls) {
        const coords = localStorage.getItem("geocoords")
        console.log(coords)
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
    .then(res => res.json())
    .then(address => {
        callback(address, 1)
    })
    .catch(err => {
        callback(err, -1)
    })
}

get_coords(true, true)