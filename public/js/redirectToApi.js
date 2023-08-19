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
    console.log("rediredtToFlights()");
    $(".to-flights").click(function () {
        const toFlightData = JSON.parse($(this).attr("data-toFlight"));
        dataToSearch = {
            destName: toFlightData.name || toFlightData.destination || null,
            departureDate: toFlightData.departureDate || null,
            returnDate: toFlightData.returnDate || null
        }
        console.log(dataToSearch);

        sessionStorage.setItem("dataToSearch", JSON.stringify(dataToSearch));

        window.location.href = '/flights';
    });
}
rediredtToFlights()