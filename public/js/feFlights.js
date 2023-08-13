function generateNewFlights() {
  fetch("/generate_new_flights", {
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
      console.log("Request for new flights done");
      console.log("Insert new flights to DB");
      console.log(flights);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function searchFlights() {
  $("#flight-search-form").on("submit", (event) => {
    event.preventDefault();
    const searchFields = {
      departure: $("#departure").val(),
      destination: $("#destination").val(),
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

function ChooseFlight(flightData) {
  console.log(flightData);
  var flightJsonData = JSON.parse(flightData);
  insertFlightDetails(flightJsonData.go, flightJsonData.return);
  
  // Calculate total price
  var totalPrice = flightJsonData.go.price + (flightJsonData.return ? flightJsonData.return.price : 0);
  
  // Insert total price into sidebar
  $('#total-price').text(totalPrice.toFixed(2) + '$');

  $('#details-sidebar').addClass('active');
}


function insertFlightDetails(goFlight, returnFlight) {
  // Insert Go Flight details
  insertSingleFlightDetails('#go-flight-details', goFlight);

  // If Return Flight exists, insert details
  if (returnFlight) {
    $('#return-flight-details').show(); // Show return flight details if available
    insertSingleFlightDetails('#return-flight-details', returnFlight);
  } else {
    $('#return-flight-details').hide(); // Hide return flight details if not available
  }
}

function insertSingleFlightDetails(containerId, flight) {
  $(containerId + ' #flightNumber').text(flight.flight.iata);
  $(containerId + ' #departureDate').text(flight.departure.dateTime);
  $(containerId + ' #arrivalDate').text(flight.arrival.dateTime);
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
}

searchFlights()
