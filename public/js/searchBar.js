
function setDefaultValuesToSearchBar() {
    const dataToSearchString = sessionStorage.getItem("dataToSearch");
    const dataToSearch = JSON.parse(dataToSearchString);
    const destinationElement = $("#destination");
    const departureDateElement = $("#departureDate");
    const returnDateElement = $("#returnDate");

    destinationElement.val(dataToSearch.destName);

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
