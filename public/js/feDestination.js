function goToDestination() {
    $(".to-destination-card").click(function () {
        const destination = $(this).data("destination");
        fetch(`/dest/${destination.name.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(destination)
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = `/dest/${destination.name.toLowerCase()}`;
                } else {
                    console.error("Error during POST request");
                }
            })
            .catch(error => {
                console.log(error);
            });
    });

}
goToDestination()

function redirectToWikipedia(destination) {
    const wikipediaLink = "https://en.wikipedia.org/wiki/" + destination
    window.open(wikipediaLink, '_blank');
}

async function createTourismChart() {
    fetch("/generate_chart_data", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(tourismData => {
            const months = tourismData.map(data => data.month);
            const tourists = tourismData.map(data => data.tourists);

            const ctx = $('#tourismChart');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Tourists by Month',
                        data: tourists,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#ffffff' // this here
                            }
                        },
                        x: {
                            ticks: {
                                color: '#ffffff' 
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff', 
                            }
                        }
                    }
                }
            });

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

}

function toggleChart() {
    const chart = $('#tourismChart');
    chart.toggle()
    createTourismChart();
}


