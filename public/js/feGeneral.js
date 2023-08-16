
function loadScreen() {
  $(window).on('load', function () {
    $('#loader-wrapper').css('display', 'none');
  })
};

function checkIfAdmin() {
    fetch('/is_admin')
      .then(response => response.json())
      .then(data => {
        if (data.isAdmin == "true") {
          $("#header-nav-bar").append('<a class="btn btn-primary my-nav-link" href="/admin">Admin</a>');
        }
      })
      .catch(error => {
        console.error('Error checking admin status:', error);
      });
}

checkIfAdmin()
loadScreen()