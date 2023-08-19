
function initializeLoadingScreen() {
  // Display the loader on every button click or link navigation
  $('button, a').on('click', function() {
      $('#loader-wrapper').show();
  });

  // Hide the loader when the current page fully loads
  $(window).on('load', function() {
      $('#loader-wrapper').hide();
  });
  
  // Display the loader when the page is about to unload (i.e., when navigating away)
  $(window).on('beforeunload', function() {
      $('#loader-wrapper').show();
  });
}


function checkIfAdmin() {
  fetch('/is_admin')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.authLevel == "admin") {
        $("#header-nav-bar").append('<a class="btn btn-primary my-nav-link" href="/admin">Admin</a>');
      }
    })
    .catch(error => {
      console.error('Error checking admin status:', error);
    });
}


function buildDestinationOptions() {
  const validDestinationsElement = $("#validDestinations");
  const dataListElement = $(".destination-options")
  if (validDestinationsElement.length > 0) {
      const validDestinations = JSON.parse(validDestinationsElement.attr("data-destinations"));
      validDestinations.forEach(destination => {
          dataListElement.append($(`<option value="${destination}">`))
      });
  }

}

function destinationValidation() {
  $(".form-with-destination").submit(function (event) {
      const validDestinationsElement = $("#validDestinations");
      const validDestinations = JSON.parse(validDestinationsElement.attr("data-destinations"));
      const destInput = $(".destination-validation")

      if (destInput.val() && (!validDestinations.includes(destInput.val()))) {
          event.preventDefault();
          alert("Not Valid Destination\n Re-Enter Destination")
          destInput.val("")
      }
  });

}

initializeLoadingScreen()
buildDestinationOptions()
destinationValidation()
checkIfAdmin()