

const comments = [["excellent", "#bdff3ab9"], ["good", "#319ebc82"], ["normal", "#799fa88b"], ["low", "#f388249c"], ["critical", "#ff494998"]]

function get_comment(percentage) {
    if (percentage >= 80) {
        return comments[0]
    }
    else if (percentage >= 60) {
        return comments[1]
    }
    else if (percentage >= 40) {
        return comments[2]
    }
    else if (percentage >= 20) {
        return comments[3]
    }
    else {
        return comments[4]
    }
}

function updateUI(data) {
    document.getElementById('districtName').textContent = data.district;
    document.getElementById('stateName').textContent = data.state;
    document.getElementById('waterLevelReading').textContent = `${data.waterLevel.toFixed(1)}m`;
    document.getElementById('lastUpdated').textContent = `Data from : past ${data.data_range} days`;

    var percentage = ((data.maxWaterLevel - data.waterLevel) / data.maxWaterLevel) * 100;
    if (percentage < 0) {
        percentage = 0
    }
    const comment = get_comment(percentage)
    const waterBar = document.getElementById('waterLevelBar');
    waterBar.style.height = `${percentage}%`;
    waterBar.innerHTML = `${(percentage / 10).toFixed(1)}`
    const waterlevel_comment = document.getElementById("waterlevel-comment")
    
    waterlevel_comment.innerHTML = comment[0]
    waterlevel_comment.style.color = comment[1]
}
