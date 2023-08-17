
function setDefaultValuesToSearchBar() {
    const dataToSearchString = sessionStorage.getItem("dataToSearch");
    const dataToSearch = JSON.parse(dataToSearchString);
    const destinationElement = $("#destination");
    const departureDateElement = $("#departureDate");
    const returnDateElement = $("#returnDate");

    if (dataToSearch && dataToSearch.destName) {
        destinationElement.val(dataToSearch.destName);
    } else {
        console.warn("Destination name not found in dataToSearch object.");
    }
    
    if (dataToSearch.departureDate) {
        const departureDate = new Date(dataToSearch.departureDate);
        departureDateElement.val(departureDate.toLocaleDateString('en-CA'));
    }

    if (dataToSearch.returnDate) {
        const returnDate = new Date(dataToSearch.returnDate);
        returnDateElement.val(returnDate.toLocaleDateString('en-CA'));
    }

    sessionStorage.removeItem("dataToSearch");
}



setDefaultValuesToSearchBar()
