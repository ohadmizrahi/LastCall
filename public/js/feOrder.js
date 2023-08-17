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

let passengerCount = 1; // Start with 1 since one form is already present

function addPassengerForm() {
    const $container = $('#passengerForms');
    const $firstForm = $container.find('form').first();
    const $clonedForm = $firstForm.clone();
    $clonedForm.find('input').val('');
    $container.append($clonedForm);
    passengerCount++;

    if (passengerCount > 1) {
        $('#removePassengerBtn').show();
    }
    ChooseFlight(JSON.stringify(flightJsonData));

}

function removePassengerForm() {
    if (passengerCount > 1) {
        $('#passengerForms').find('form').last().remove();
        passengerCount--;
    }

    if (passengerCount === 1) {
        $('#removePassengerBtn').hide();
    }
    ChooseFlight(JSON.stringify(flightJsonData));

}

function CalculatePrice(numberOfMembers, goPrice, returnPrice) {
  let totalPrice = goPrice + (returnPrice ? returnPrice : 0);
  totalPrice *= passengerCount;
  return totalPrice;
}

function updateTotalPrice() {
  let totalPrice = (goPrice + (returnPrice ? returnPrice : 0)) * passengerCount;
  document.getElementById('totalPrice').textContent = "Total Price: $" + totalPrice;
}

updateTotalPrice();

$(document).ready(function() {
  updateTotalPrice();
});