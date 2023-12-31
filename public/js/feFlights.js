let flightJsonData;
function ChooseFlight(flightData) {
  flightJsonData = JSON.parse(flightData);
  flightJsonData.totalPrice = CalculatePrice(flightJsonData.go.price, flightJsonData.return ? flightJsonData.return.price : 0);
  insertFlightDetails(flightJsonData.go, flightJsonData.return, flightJsonData.totalPrice);
  $('#details-sidebar').addClass('active');
}

function insertFlightDetails(goFlight, returnFlight, totalPrice) {

  insertSingleFlightDetails('#go-flight-details', goFlight);
  if (returnFlight) {
    $('#return-flight-details').show();
    insertSingleFlightDetails('#return-flight-details', returnFlight);
  } else {
    $('#return-flight-details').hide();
  }
  if (totalPrice) {
    let pricePerPerson = totalPrice / passengerCount;
    $('#total-price-per-person').text(pricePerPerson.toFixed(2) + '$');
    $('#total-price').text(totalPrice.toFixed(2) + '$');
  }
}

function insertSingleFlightDetails(containerId, flight) {
  let departureDate = formatDate(flight.departure.dateTime);
  let arrivalDate = formatDate(flight.arrival.dateTime);
  let departureTime = formatTime(flight.departure.dateTime);
  let arrivalTime = formatTime(flight.arrival.dateTime);

  $(containerId + ' #flightNumber').text(flight.flight.iata);
  $(containerId + ' #departureDate').text(departureDate);
  $(containerId + ' #departureTime').text(departureTime);
  $(containerId + ' #arrivalDate').text(arrivalDate);
  $(containerId + ' #airlineName').text(flight.airline.name);
  $(containerId + ' #source').text(flight.departure.iata);
  $(containerId + ' #departureAirport').text(flight.departure.airport);
  $(containerId + ' #departureTerminal').text(flight.departure.terminal);
  $(containerId + ' #departureCountry').text(flight.departure.country);
  $(containerId + ' #destination').text(flight.arrival.iata);
  $(containerId + ' #arrivalAirport').text(flight.arrival.airport);
  $(containerId + ' #arrivalTerminal').text(flight.arrival.terminal);
  $(containerId + ' #arrivalCountry').text(flight.arrival.country);
  $(containerId + ' #price').text('$' + flight.price);
  $(containerId + ' #departureCity').text(flight.departure.city);
  $(containerId + ' #arrivalCity').text(flight.arrival.city);
  $(containerId + ' #duration').text(flight.flight.duration);
  $(containerId + ' #arrivalTime').text(arrivalTime);
}
function closeSideBar() {
  $("#close-sidebar").on("click", function () {
    $("#details-sidebar").removeClass("active");
  });
}

function formatDate(date) {
  let dateObject = new Date(date);
  dateObject.setMinutes(dateObject.getMinutes() - 180)
  return dateObject.getDate().toString().padStart(2, '0') + '/' +
    (dateObject.getMonth() + 1).toString().padStart(2, '0') + '/' +
    dateObject.getFullYear();
};


function formatTime(dateTime) {
  let dateTimeObject = new Date(dateTime)
  dateTimeObject.setMinutes(dateTimeObject.getMinutes() - 180)
  let hours = dateTimeObject.getHours().toString().padStart(2, '0');
  let minutes = dateTimeObject.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}


$(document).ready(function () {
  closeSideBar()
});
