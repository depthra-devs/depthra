
const map_container = document.getElementById('map-container');
map_container.style.height = '400px';
const region_display = document.getElementById("region-display")

const map_overlay = document.getElementById("map-overlay")
var map_disabled = true

const loader_label = document.getElementById("loader-label")

function disable_map() {
    map_overlay.classList.remove("d-none")
    map_disabled = true
}

function enable_map() {
    loader_label.innerHTML = "fetching data"
    map_overlay.classList.add("d-none")
    map_disabled = false
}

var map = get_map("map-container")
var marker = null

function update_gw_data_avg_neighbours(addresses, home_addr) {
    var fetched_neighbour_count = 0
    var successful_fetches = 0
    var water_level_total = 0
    var data_count = 0
    addresses.forEach(function(address) {
        fetch_telemetric_gw_dataset(address[0], address[1], "cgwb", formatDate(getDateNDaysBefore(DATE_TODAY, 3)), formatDate(DATE_TODAY), false, 0, Math.round(200 / addresses.length), function(data, status) {
            if (status == 1) {
                successful_fetches += 1
                data_count += data.length
                data.forEach(dat => {
                    water_level_total += dat.dataValue
                })
            }
            fetched_neighbour_count += 1
            if (fetched_neighbour_count == addresses.length) {
                if (successful_fetches == 0) {
                    loader_label.innerHTML = "Unfortunately no nearby stations available for ground water data. <br> map enabling in 3 seconds"
                    setTimeout(enable_map, 3000)
                    return
                }
                var average_water_level = water_level_total / data_count
                average_water_level = Math.abs(average_water_level)
                enable_map()
                updateUI({state : home_addr[0], district : home_addr[1], waterLevel : average_water_level, maxWaterLevel : 50, data_range : 3})
            
            }
        })
    })
}

function update_gw_data(address, coords) {
    region_display.innerHTML = `${address.country}, ${address.state}, ${address.state_district}`
    fetch_telemetric_gw_dataset(address.state, address.state_district, "cgwb", formatDate(getDateNDaysBefore(DATE_TODAY, 3)), formatDate(DATE_TODAY), false, 0, 200, function(data, status) {
        if (status == 0) {
            loader_label.innerHTML = "no stations found for your district <br> analysing nearby stations"
            get_neighbours_address(coords, [address.state, address.state_district], 1, function(addresses, status) {
                update_gw_data_avg_neighbours(addresses, [address.state, address.state_district])
            })
            return
        }
        var water_level_total = 0
        data.forEach(dat => {
            water_level_total += dat.dataValue
        })
        var average_water_level = water_level_total / data.length
        average_water_level = Math.abs(average_water_level)
        enable_map()
        updateUI({state : address.state, district : address.state_district, waterLevel : average_water_level, maxWaterLevel : 50, data_range : 3})
    })
}

set_map_markevent(map, function(coords) {
    if (map_disabled) return
    if (marker) remove_marker_on_map(map, marker)
    marker = add_marker_on_map(coords, map)
    get_address(coords[0], coords[1], function(address, status) {
        if (address.country != "India") {
            region_display.innerHTML = "Please select a location within India."
        }
        else if (status == -1 || address.state == undefined || address.state_district == undefined) {
            region_display.innerHTML = "Invalid location selected."
        }
        else {
            disable_map()
            update_gw_data(address, coords)
        }
    })
})

get_coords(true, true, function(coords, status) {
    if (marker) remove_marker_on_map(map, marker)
    marker = add_marker_on_map(coords, map)
    get_address(coords[0], coords[1], function(address, status) {
        if (address.country != "India") {
            region_display.innerHTML = "Please select a location within India."
        }
        else if (status == -1 || address.state == undefined || address.state_district == undefined) {
            region_display.innerHTML = "Invalid location selected."
        }
        else {
            update_gw_data(address, coords)
        }
    })
})