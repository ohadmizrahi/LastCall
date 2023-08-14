function cubeRediredtTo() {
$(".cube").click(function () {
    const apiURL = $(this).data("api");
    window.location.href = apiURL;
});
}
cubeRediredtTo()

function rediredtToFlights() {
    $(".to-flights").click(function () {
        const toFlightData = JSON.parse($(this).attr("data-toFlight"));
        dataToSearch = {
            destName: toFlightData.name || toFlightData.destination || null,
            departureDate: toFlightData.departureDate || null,
            returnDate: toFlightData.returnDate || null
        }

        sessionStorage.setItem("dataToSearch", JSON.stringify(dataToSearch));

        window.location.href = '/flights';
    });
}
rediredtToFlights()