 $('#continue-btn').click(function() {
    var flightData = {
      flight: {
        iata: $('#flightNumber').text(),
        date: $('#flightDate').text(),
        airlineName: $('#airlineName').text(),
        source: $('#source').text(),
        departureAirport: $('#departureAirport').text(),
        departureTerminal: $('#departureTerminal').text(),
        departureCountry: $('#departureCountry').text(),
        destination: $('#destination').text(),
        arrivalAirport: $('#arrivalAirport').text(),
        arrivalTerminal: $('#arrivalTerminal').text(),
        arrivalCountry: $('#arrivalCountry').text(),
        price: $('#price').text()
      }
    };
    localStorage.setItem('flightData', JSON.stringify(flightData));
    window.location.href = '/order_flight';
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
  