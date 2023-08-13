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


function insertFlightDetails(flight) {
  $('#flightNumber').text(flight.flight.iata);
  $('#flightDate').text(flight.flight.date);
  $('#airlineName').text(flight.airline.name);
  $('#source').text(flight.departure.iata);
  $('#departureAirport').text(flight.departure.airport);
  $('#departureTerminal').text(flight.departure.terminal);
  $('#departureCountry').text(flight.departure.country);
  $('#destination').text(flight.arrival.iata);
  $('#arrivalAirport').text(flight.arrival.airport);
  $('#arrivalTerminal').text(flight.arrival.terminal);
  $('#arrivalCountry').text(flight.arrival.country);
  $('#price').text('$' + flight.price);
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
  var flightJsonData = JSON.parse(flightData);
  insertFlightDetails(flightJsonData);
  $('#details-sidebar').addClass('active');
}

searchFlights()
