function blockInputPriceOrDiscount() {
    const price = $("input[name='newPrice']")
    const discount = $("input[name='discount']")
price.on("input", () => {
    if (price.val()) {
        discount.prop("disabled", true);
        discount.val("")
    } else {
        discount.prop("disabled", false);
    }
})

discount.on("input", () => {
    if (discount.val()) {
        price.prop("disabled", true);
        price.val("")
    } else {
        price.prop("disabled", false);
    }
})

}
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