
function fetch_gw_dataset(state, district, agency, startdate, enddate, download = false, page = 0, size = 1, callback = function(data, status) {console.log(data, status)}) {
    state = state.replace(/ /g, "%20")
    district = district.replace(/ /g, "%20")
    agency = agency.replace(/ /g, "%20")
    const url = `http://localhost:3000/app/depthra?stateName=${state}&districtName=${district}&agencyName=${agency}&startdate=${startdate}&enddate=${enddate}&download=${download}&page=${page}&size=${size}`
    fetch(`http://localhost:3000/app/depthra?stateName=${state}&districtName=${district}&agencyName=${agency}&startdate=${startdate}&enddate=${enddate}&download=${download}&page=${page}&size=${size}`)
    .then(res => res.json())
    .then(data => {
        if (data.statusCode == 500) {
            callback([], 0)
        }
        else {
            callback(data.data, 1)
        }
    })
    .catch(err => {
        callback(err, -1)
    });
}

function fetch_telemetric_gw_dataset(state, district, agency, startdate, enddate, download = false, page = 0, size = 1, callback = function(data, status) {console.log(data, status)}) {
    fetch_gw_dataset(state, district, agency, startdate, enddate, download, page, size, function(data, status) {
        if (status == 1) {
            var data_set = []
            data.forEach(dat => {
                if (dat.dataAcquisitionMode == "Telemetric") {
                    data_set.push(dat)
                }
            })
            if (data_set.length == 0) {
                callback([], 0)
            }
            else {
                callback(data_set, 1)
            }
        }
        else if (status == 0) {
            callback([], 0)
        }
        else {
            callback(data, -1)
        }
    })
}
