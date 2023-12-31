function continuteToOrder() {
  $('#continue-btn').on("click", function () {
    localStorage.setItem('flightData', JSON.stringify(flightJsonData));

    fetch("/setFlightData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        flightData: flightJsonData
      })
    })

      .then(response => {
        if (response.ok) {
          window.location.href = '/order';
        } else {
          console.error('Failed to set flight data.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
}
function orderFlight() {

  $('#card-details-form').on("submit", function (e) {
    e.preventDefault();

    if (isFormFilled($('.form-validation'))) {
      const passangerDetails = $(".passenger-form").serializeArray()
      let usersData = {}
      let usersCount = 0
      passangerDetails.forEach((passengerData) => {
        if (passengerData.name == "passenger-count") {
          usersCount++
          usersData[`user${usersCount}`] = {};
        }
        const currentUser = usersData[`user${usersCount}`];
        if (passengerData.name == "first-name") {
          currentUser.fName = passengerData.value
        } else if (passengerData.name == "last-name") {
          currentUser.lName = passengerData.value
        } else if (passengerData.name == "email") {
          currentUser.email = passengerData.value
        } else if (passengerData.name == "passport") {
          currentUser.passport = passengerData.value
        }
      })
      const flightsDataString = $('#ordered-flights').attr('data-flights');
      const flightsData = JSON.parse(flightsDataString);

      fetch("/order", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flightsData: flightsData,
          usersData: usersData
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/flights';
          } else {
            window.location.href = '/order';
          }

        })
        .catch(error => {
          console.log(error);
        });

    } else {
      alert('Please fill out all fields before confirming your order.');
    }
  });
}

function isFormFilled(formElem) {

  let inputFields = formElem.find('input, select');

  for (const input of inputFields) {
    const inputValue = $(input).val().trim();

    if (inputValue === '') {
      return false;
    }
  }
  return true;
}


let passengerCount = 1;

function addPassengerForm() {
  const formsContainer = $('#forms-container');
  const lastForm = $(".passenger-form").last();
  if (!isFormFilled(lastForm)) {
    alert("Please fill out all fields in the last form before adding another passenger.");
    return;
  }
  const clonedForm = lastForm.clone();
  clonedForm.find('input, select').val('');
  passengerCount++;
  clonedForm.find('h3').text('Passenger ' + passengerCount);
  clonedForm.find("#passenger-count").val(passengerCount)
  formsContainer.append(clonedForm);
  if (passengerCount > 1) {
    $('#removePassengerBtn').show();
  }
  ChooseFlight(JSON.stringify(flightJsonData));
}



function addRemovePassengers() {
  $("#add-form-btn").on("click", addPassengerForm);
  $("#removePassengerBtn").on("click", removePassengerForm);
}


function removePassengerForm() {
  if (passengerCount > 1) {
    $('#forms-container').find('.passenger-form').last().remove();
    passengerCount--;
  }

  if (passengerCount === 1) {
    $('#removePassengerBtn').hide();
  }
  ChooseFlight(JSON.stringify(flightJsonData));
}


function CalculatePrice(goPrice, returnPrice) {
  let totalPrice = goPrice + (returnPrice ? returnPrice : 0);
  totalPrice *= passengerCount;
  return totalPrice;
}


let goPrice = 0;
let returnPrice = 0;

function updateTotalPrice() {
  let totalPrice = CalculatePrice(goPrice, returnPrice);
  let element = $('#totalPrice');
  if (element.length > 0) {
    element.text("Total Price: $" + totalPrice);
  } else {
    console.warn("Element with ID 'totalPrice' not found.");
  }
}


$(document).ready(function () {
  updateTotalPrice();
  continuteToOrder();
  orderFlight();
  addRemovePassengers();
});

