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
        }
    })
})