

function generateNewFlights() {
    fetch("/admin/generate_new_flights", {
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
        .then(flights => {
            console.log(`${flights.flightsCount} flights was inserted`)
            window.location.href = "/admin"
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = "/admin"
        });
}

function showHideReturnFlight() {
    $("#returnFlightCheckbox").change(function () {
        if (this.checked) {
            $("#returnFlightDetails").collapse("show");
            $(".return-detail").attr("required", true);
        } else {
            $("#returnFlightDetails").collapse("hide");
            $(".return-detail").removeAttr("required");
        }
    })
}


showHideReturnFlight()
destinationValidation()