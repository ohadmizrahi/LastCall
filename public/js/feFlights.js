function searchFlights() {
  $("#flight-search-form").on("submit", (event) => {
    event.preventDefault();
    const searchFields = {
      departure: toTitleCase($("#departure").val()),
      destination: toTitleCase($("#destination").val()),
      departureDate: $("#departureDate").val(),
      arrivalDate: $("#returnDate").val(),
      travelers: $("#travelers").val()
    }

    fetch("/search_flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ searchFields })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Search request failed");
        }
        return response.json();
      })
      .then(status => {
        window.location.href = "/flights"
      })
      .catch(error => {
        console.error(error);
      });
  });
}


$(document).ready(function () {
  $('#outbound-time').on('input', function () {
    var value = $(this).val();
    var displayValue = value == 23 ? '24:59' : value + ':59';
    $('#outbound-time-display').text('0:00 - ' + displayValue);
  });

  $('#return-time').on('input', function () {
    var value = $(this).val();
    var displayValue = value == 23 ? '24:59' : value + ':59';
    $('#return-time-display').text('0:00 - ' + displayValue);
  });

  $('#flight-duration').on('input', function () {
    var value = $(this).val();
    $('#flight-duration-display').text(value + ' hours - ' + (parseFloat(value) + 0.5) + ' hours');
  });

  $('#price-range').on('input', function () {
    var value = $(this).val();
    $('#price-range-display').text('$100 - $' + value);
  });

  // Close the sidebar when the close button is clicked
  $('#close-sidebar').click(function () {
    $('#details-sidebar').removeClass('active');
  });

  // Handle the form submission (replace with your logic)
  $('#details-form').submit(function (e) {
    e.preventDefault();
    // Process the form data here
  });
});

var flightJsonData;
function ChooseFlight(flightData) {
  flightJsonData = JSON.parse(flightData);
  flightJsonData.totalPrice = CalculatePrice(1, flightJsonData.go.price, flightJsonData.return ? flightJsonData.return.price : 0);
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
    let pricePerPerson = totalPrice / passengerCount;  // Price per person
    $('#total-price-per-person').text(pricePerPerson.toFixed(2) + '$');
    $('#total-price').text(totalPrice.toFixed(2) + '$');
  }
}

function insertSingleFlightDetails(containerId, flight) {
  var departureTime = new Date(flight.departure.dateTime).toUTCString().split(' ')[4].slice(0, 5);
  var arrivalTime = new Date(flight.arrival.dateTime).toUTCString().split(' ')[4].slice(0, 5); // Extract arrival time
  var departureDate = formatDateTime(flight.departure.dateTime);
  var arrivalDate = formatDateTime(flight.arrival.dateTime);
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


function formatDateTime (dateTime) {
  var date = new Date(dateTime);
  return date.getDate().toString().padStart(2, '0') + '/' +
         (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
         date.getFullYear();
};

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
  });
}

searchFlights()
