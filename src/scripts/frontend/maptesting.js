// Place your map initialization code here.
// Example using a placeholder to simulate a map:
const map_container = document.getElementById('map-container');
map_container.style.height = '400px'; // Set a fixed height for the map view
const region_display = document.getElementById("region-display")

var map = get_map("map-container")
var marker = null

set_map_markevent(map, function(coords) {
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
            region_display.innerHTML = `${address.country}, ${address.state}, ${address.state_district}`
            fetch_telemetric_gw_dataset(address.state, address.state_district, "cgwb", "2025-01-02", "2025-01-03", false, 0, 1000, function(data, status) {
                console.log(data, status);
                
                var water_level_total = 0
                data.forEach(dat => {
                    water_level_total += dat.dataValue
                })
                var average_water_level = water_level_total / data.length
                average_water_level = Math.abs(average_water_level)
                updateUI({state : address.state, district : address.state_district, waterLevel : average_water_level, maxWaterLevel : 50, lastUpdatedMinutes : 5})
            })
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
            region_display.innerHTML = `${address.country}, ${address.state}, ${address.state_district}`
            fetch_telemetric_gw_dataset(address.state, address.state_district, "cgwb", "2025-01-02", "2025-01-03", false, 0, 200, function(data, status) {
                var water_level_total = 0
                data.forEach(dat => {
                    water_level_total += dat.dataValue
                })
                var average_water_level = water_level_total / data.length
                average_water_level = Math.abs(average_water_level)
                updateUI({state : address.state, district : address.state_district, waterLevel : average_water_level, maxWaterLevel : 50, lastUpdatedMinutes : 5})
            })
        }
    })
})