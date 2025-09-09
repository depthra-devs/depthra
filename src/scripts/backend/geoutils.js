
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
        callback(address, 1);
    })
    .catch(err => {
        callback(err, -1)
    })
}

function get_neighbours_address(coords, home_addr, nbr_count_perdir = 1, callback = function(addresses, status) {console.log(addresses, status)}) {
    const MAX_TRY_COUNT_PERDIR = 15
    var neighbour_addr_east = []
    var neighbour_addr_south = []
    var neighbour_addr_west = []
    var neighbour_addr_north = []
    var neighbour_addr = []
    var counters = [0, 0, 0, 0]
    var offsets = [0.2, 0.2, 0.2, 0.2]
    var statuses = [0, 0, 0, 0]
    const LAT = coords[0]
    const LON = coords[1]
    function add_east_neighbour() {
        if (counters[0] >= MAX_TRY_COUNT_PERDIR || neighbour_addr_east.length >= nbr_count_perdir) {
            statuses[0] = 1
            const overall_status = statuses.every(function(status) {
                return status == 1
            })
            if (overall_status) {
                callback(neighbour_addr, 1)
            }
            return
        }
        counters[0] += 1
        get_address(LAT + offsets[0], LON, function(address, status) {
            if (status == 1) {
                const not_home = address.state != home_addr[0] || address.state_district != home_addr[1]
                const exists = neighbour_addr.some(function(addr) {
                    return addr[0] == address.state && addr[1] == address.state_district
                })
                if (!exists && not_home) {
                    neighbour_addr_east.push([address.state, address.state_district])
                    neighbour_addr.push([address.state, address.state_district])
                }
            }
            offsets[0] += 0.1
            add_east_neighbour()
        })
    }
    function add_south_neighbour() {
        if (counters[1] >= MAX_TRY_COUNT_PERDIR || neighbour_addr_south.length >= nbr_count_perdir) {
            statuses[1] = 1
            const overall_status = statuses.every(function(status) {
                return status == 1
            })
            if (overall_status) {
                callback(neighbour_addr, 1)
            }
            return
        }
        counters[1] += 1
        get_address(LAT, LON + offsets[1], function(address, status) {
            if (status == 1) {
                const not_home = address.state != home_addr[0] || address.state_district != home_addr[1]
                const exists = neighbour_addr.some(function(addr) {
                    return addr[0] == address.state && addr[1] == address.state_district
                })
                if (!exists && not_home) {
                    neighbour_addr_south.push([address.state, address.state_district])
                    neighbour_addr.push([address.state, address.state_district])
                }
            }
            offsets[1] += 0.1
            add_south_neighbour()
        })
    }
    function add_west_neighbour() {
        if (counters[2] >= MAX_TRY_COUNT_PERDIR || neighbour_addr_west.length >= nbr_count_perdir) {
            statuses[2] = 1
            const overall_status = statuses.every(function(status) {
                return status == 1
            })
            if (overall_status) {
                callback(neighbour_addr, 1)
            }
            return
        }
        counters[2] += 1
        get_address(LAT - offsets[2], LON, function(address, status) {
            if (status == 1) {
                const not_home = address.state != home_addr[0] || address.state_district != home_addr[1]
                const exists = neighbour_addr.some(function(addr) {
                    return addr[0] == address.state && addr[1] == address.state_district
                })
                if (!exists && not_home) {
                    neighbour_addr_west.push([address.state, address.state_district])
                    neighbour_addr.push([address.state, address.state_district])
                }
            }
            offsets[2] += 0.1
            add_west_neighbour()
        })
    }
    function add_north_neighbour() {
        if (counters[3] >= MAX_TRY_COUNT_PERDIR || neighbour_addr_north.length >= nbr_count_perdir) {
            statuses[3] = 1
            const overall_status = statuses.every(function(status) {
                return status == 1
            })
            if (overall_status) {
                callback(neighbour_addr, 1)
            }
            return
        }
        counters[3] += 1
        get_address(LAT, LON - offsets[3], function(address, status) {
            if (status == 1) {
                const not_home = address.state != home_addr[0] || address.state_district != home_addr[1]
                const exists = neighbour_addr.some(function(addr) {
                    return addr[0] == address.state && addr[1] == address.state_district
                })
                if (!exists && not_home) {
                    neighbour_addr_north.push([address.state, address.state_district])
                    neighbour_addr.push([address.state, address.state_district])
                }
            }
            offsets[3] += 0.1
            add_north_neighbour()
        })
    }
    add_east_neighbour()
    add_south_neighbour()
    add_west_neighbour()
    add_north_neighbour()
}


//assuming leaflet.js is loaded

function get_map(display_element_id) {
    var map = L.map(display_element_id, {
        center : [20.5937, 78.9629],
        zoom: 10,
        maxZoom : 19,
        minZoom : 2,
        maxBounds: [
            [-90, -180],
            [90, 180]
        ],
        maxBoundsViscosity: 1.0}).setView([20.5937, 78.9629], 5)
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
