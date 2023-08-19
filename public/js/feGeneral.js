
function initializeLoadingScreen() {
  // Hide the loader when the current page fully loads
  $(window).on('load', function() {
      $('#loader-wrapper').hide();
  });
  
  // Display the loader when the page is about to unload (i.e., when navigating away)
  $(window).on('beforeunload', function() {
      $('#loader-wrapper').show();
  });

  $("#auto-new-flights").on('click', function() {
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
  const validationDataElement = $("#validationData");
  const dataListElement = $(".data-options")
  if (validationDataElement.length > 0) {
      const validationData = JSON.parse(validationDataElement.attr("data-validationData"));
      validationData.forEach(destination => {
          dataListElement.append($(`<option value="${destination}">`))
      });
  }

}

function optionsValidation() {
  $(".form-with-validation").submit(function (event) {
      const validationDataElement = $("#validationData");
      const validationData = JSON.parse(validationDataElement.attr("data-validationData"));
      const destInput = $(".data-validation")

      if (destInput.val() && (!validationData.includes(destInput.val()))) {
          destInput.val("")
      }
  });

}

initializeLoadingScreen()
buildDestinationOptions()
optionsValidation()
checkIfAdmin()