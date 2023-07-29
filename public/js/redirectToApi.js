function cubeRediredtTo() {
$(".cube").click(function () {
    const apiURL = $(this).data("api");
    window.location.href = apiURL;
});
}
cubeRediredtTo()

function saleRediredtTo() {
    $('.sale-item').on('click', function() {
        // Redirect to a different route
        window.location.href = '/flights'; // Replace '/new-route' with the desired URL
        });
}
saleRediredtTo()

function goToFlightPage(destination, dealDate) {
    // Convert dealDate to a format that the date input field can understand (yyyy-mm-dd)
    const formattedDate = new Date(dealDate.split('/').reverse().join('-')).toISOString().split('T')[0];
    
    // Store the destination and deal date in localStorage
    localStorage.setItem('prefillDestination', destination);
    localStorage.setItem('prefillDepartureDate', formattedDate);
  
    // Redirect to the flight page
    window.location.href = '/flights';  // Replace with the actual URL of your flight page
  }
  
  goToFlightPage()