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
  
  $(document).ready(function() {
    $('#outbound-time').on('input', function() {
        var value = $(this).val();
        var displayValue = value == 23 ? '24:59' : value + ':59';
        $('#outbound-time-display').text('0:00 - ' + displayValue);
    });

    $('#return-time').on('input', function() {
        var value = $(this).val();
        var displayValue = value == 23 ? '24:59' : value + ':59';
        $('#return-time-display').text('0:00 - ' + displayValue);
    });

    $('#flight-duration').on('input', function() {
        var value = $(this).val();
        $('#flight-duration-display').text(value + ' hours - ' + (parseFloat(value) + 0.5) + ' hours');
    });
});


$(document).ready(function() {
  // Other event listeners here

  $('#price-range').on('input', function() {
      var value = $(this).val();
      $('#price-range-display').text('$100 - $' + value);
  });
});

