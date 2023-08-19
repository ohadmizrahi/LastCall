$('#continue-btn').click(function() {
    localStorage.setItem('flightData', JSON.stringify(flightJsonData));
    window.location.href = '/order?flightData=' + JSON.stringify(flightJsonData);
  });

  function initializeModalHandlers() {
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
}

initializeModalHandlers();

$(document).ready(function() {
  $('#card-details-form').submit(function(e) {
    e.preventDefault(); // Prevent form from submitting

    if (isFormFilled($('#passenger-details-form')) && isFormFilled($('#card-details-form'))) {
      showConfirmationModal();
    } else {
      alert('Please fill out all fields before confirming your order.');
    }
  });

  $('#go-home-btn').click(function() {
    $('#confirmation-modal').hide(); // Hide the modal when "Go Home" is clicked
    // Optionally, you can redirect the user to the homepage here
    // window.location.href = '/home';
  });
});

function isFormFilled(formElem) {
  let inputs = formElem.find('input, select');
  let allFilled = true;

  inputs.each(function() {
    if ($(this).val() === '') {
      allFilled = false;
      return false; // breaks out of the .each() loop
    }
  });
  return allFilled;
}

function showConfirmationModal() {
  $('#confirmation-modal').show(); // Show the modal
}



let passengerCount = 1; // Start with 1 since one form is already present
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
  clonedForm.attr('id', 'passenger-details-form-' + passengerCount);
  formsContainer.append(clonedForm);
  if (passengerCount > 1) {
      $('#removePassengerBtn').show();
  }
  // If you have the ChooseFlight function in your code, include this. Otherwise, remove the next line.
  ChooseFlight(JSON.stringify(flightJsonData));
}



$(document).ready(function() {
  $("#add-form-btn").click(addPassengerForm);
  $("#removePassengerBtn").click(removePassengerForm);
});

function removePassengerForm() {
    if (passengerCount > 1) {
        $('#forms-container').find('.passenger-form').last().remove();
        passengerCount--;
    }

    if (passengerCount === 1) {
        $('#removePassengerBtn').hide();
    }
    // Assuming ChooseFlight is a function you've defined elsewhere
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
    let elem = document.getElementById('totalPrice');
    if (elem) {
      elem.textContent = "Total Price: $" + totalPrice;
    } else {
      console.warn("Element with ID 'totalPrice' not found.");
    }
}

$(document).ready(function() {
  updateTotalPrice();
});

