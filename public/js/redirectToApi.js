
function rediredtToAPI() {
    $(".redirect-to").on("click", function () {
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
        const searchBarValues = {
            destName: toFlightData.name || toFlightData.destination || null,
            departureDate: toFlightData.departureDate || null,
            returnDate: toFlightData.returnDate || null
        }
        if (toFlightData.departureDate && toFlightData.returnDate) {
            const searchQueryValues = {
                departure: "Tel Aviv",
                destination: toFlightData.destination,
                departureDate: toFlightData.departureDate,
                returnDate: toFlightData.returnDate, 
                manual: true
            }

            fetch("/search_flights", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchQueryValues)
            })
                .then(response => response.json())
                .then(data => {
                    window.location.href = '/flights';
                })
                .catch(error => {
                    console.log(error);
                });

        }

        sessionStorage.setItem("searchBarValues", JSON.stringify(searchBarValues));

        window.location.href = '/flights';
    });
}
rediredtToFlights()