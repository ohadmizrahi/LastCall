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
  