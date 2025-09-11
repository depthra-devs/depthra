
const graphcanvas = document.getElementById("water-level-history-chart")
graphcanvas.width = graphcanvas.parentElement.parentElement.clientWidth
const ctx = graphcanvas.getContext('2d');

const waterChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuad'
        },
        scales: {
            x: {
                title: { display: true, text: 'Month' }
            },
            y: {
                title: { display: true, text: 'Water level (mbgl)' },
            }
        }
    }
});
function addData(value_x, value_y) {
    waterChart.data.labels.push(value_x);
    waterChart.data.datasets[0].data.push(value_y);
    if (waterChart.data.labels.length > 10) {
        waterChart.data.labels.shift();
        waterChart.data.datasets[0].data.shift();
    }
    waterChart.update();
}