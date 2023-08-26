function setDefaultValuesToSearchBar() {
    const searchBarValuesString = sessionStorage.getItem("searchBarValues");
    const searchBarValues = JSON.parse(searchBarValuesString);
    const destinationElement = $("#destination");
    const departureElement = $("#departure");
    const departureDateElement = $("#departureDate");
    const returnDateElement = $("#returnDate");

    if (!searchBarValues) {
        console.warn("searchBarValues object is not available:", searchBarValuesString);
        return; // Exit the function early if searchBarValues is null or undefined
    }

    if (searchBarValues.destName) {
        destinationElement.val(searchBarValues.destName);
    } else {
        console.warn("Destination name not found in searchBarValues object.");
    }

    if (searchBarValues.departureDate) {
        const departureDate = new Date(searchBarValues.departureDate);
        departureDateElement.val(departureDate.toLocaleDateString('en-CA'));
    }

    if (searchBarValues.returnDate) {
        const returnDate = new Date(searchBarValues.returnDate);
        returnDateElement.val(returnDate.toLocaleDateString('en-CA'));
    }
    if (searchBarValues.depName) {
        departureElement.val(searchBarValues.depName)
    }

    sessionStorage.removeItem("searchBarValues");
}

$(document).ready(function () {
    setDefaultValuesToSearchBar()
});

