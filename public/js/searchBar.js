
function setDefaultValuesToSearchBar() {
    const dataToSearchString = sessionStorage.getItem("dataToSearch");
    const dataToSearch = JSON.parse(dataToSearchString);
    const destinationElement = $("#destination")
    const departureDateElement = $("#departureDate")
    const returnDateElement = $("#returnDate")
    console.log("OK");
    console.log(dataToSearch);
    destinationElement.val(dataToSearch.destName)
    departureDateElement.val(dataToSearch.departureDate)
    returnDateElement.val(dataToSearch.returnDate)
    sessionStorage.removeItem("dataToSearch");
}

setDefaultValuesToSearchBar()
