
function adminDestinationValidation() {
    $(".form-with-destination").submit(function(event) {
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
adminDestinationValidation()
buildDestinationOptions()
blockInputPriceOrDiscount()