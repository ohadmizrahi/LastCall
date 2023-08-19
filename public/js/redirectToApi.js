function rediredtToAPI() {
    $(".redirect-to").click(function () {
        let apiURL = $(this).data("api");
        if (!apiURL) {
            apiURL = "/home"
        }
        window.location.href = apiURL;
    });
}
rediredtToAPI()

function rediredtToFlights() {
    $(".to-flights").on("click", function () {
        const toFlightData = JSON.parse($(this).attr("data-toFlight"));
        dataToSearch = {
            destination: toFlightData.name || toFlightData.destination || null,
            departureDate: toFlightData.departureDate || null,
            returnDate: toFlightData.returnDate || null
        }

        sessionStorage.setItem("dataToSearch", JSON.stringify(dataToSearch));
        if (toFlightData.departureDate && toFlightData.returnDate) {
            fetch("/search_flights", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSearch)
            })
                .then(response => response.json())
                .then(data => {
                    window.location.href = '/flights';
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            window.location.href = '/flights';
        }
    });
}
rediredtToFlights()