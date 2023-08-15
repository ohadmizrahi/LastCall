 $('#continue-btn').click(function() {
    localStorage.setItem('flightData', JSON.stringify(flightJsonData));
    window.location.href = '/order?flightData=' + JSON.stringify(flightJsonData);
  });
  
  $(document).ready(function() {
    var flightData = JSON.parse(localStorage.getItem('flightData'));
    
    $('#flightNumber').text(flightData.flight.iata);
    $('#flightDate').text(flightData.flight.date);
    $('#airlineName').text(flightData.flight.airlineName);
    $('#source').text(flightData.flight.source);
    $('#departureAirport').text(flightData.flight.departureAirport);
    $('#departureTerminal').text(flightData.flight.departureTerminal);
    $('#departureCountry').text(flightData.flight.departureCountry);
    $('#destination').text(flightData.flight.destination);
    $('#arrivalAirport').text(flightData.flight.arrivalAirport);
    $('#arrivalTerminal').text(flightData.flight.arrivalTerminal);
    $('#arrivalCountry').text(flightData.flight.arrivalCountry);
    $('#price').text(flightData.flight.price);
  });
  

  $(document).ready(function() {
    $('#order-form').submit(function(e) {
      e.preventDefault(); // Prevent the form from actually submitting
      $('#confirmation-modal').show(); // Show the modal
    });
  
    $('#go-home-btn').click(function() {
      $('#confirmation-modal').hide(); // Hide the modal
      window.location.href = '/home'; // Redirect to the home page (update as needed)
    });
  });
  