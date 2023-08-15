$(document).ready(() => {
    var flightsDetails = JSON.parse(document.getElementById('flight-details').getAttribute("data"));
    insertFlightDetails(flightsDetails.go, flightsDetails.return, 0);
});