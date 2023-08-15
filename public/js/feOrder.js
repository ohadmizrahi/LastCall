$(document).ready(() => {
    var flightsDetails = JSON.parse(document.getElementById('flight-details').getAttribute("data"));
    insertFlightDetails(flightsDetails.go, flightsDetails.return, 0);
});

function displayFlightDetails(flightData) {
    flightJsonData = JSON.parse(flightData);
    flightJsonData.totalPrice = flightJsonData.go.price + (flightJsonData.return ? flightJsonData.return.price : 0);
    insertFlightDetails(flightJsonData.go, flightJsonData.return, flightJsonData.totalPrice);

    $('#details-sidebar').addClass('active');
}
