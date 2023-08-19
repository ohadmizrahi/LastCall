function setDefaultValuesToSearchBar() {
    const dataToSearchString = sessionStorage.getItem("dataToSearch");
    const dataToSearch = JSON.parse(dataToSearchString);
    const destinationElement = $("#destination");
    const departureDateElement = $("#departureDate");
    const returnDateElement = $("#returnDate");

    if (!dataToSearch) {
        console.warn("dataToSearch object is not available:", dataToSearchString);
        return; // Exit the function early if dataToSearch is null or undefined
    }

    if (dataToSearch.destination) {
        destinationElement.val(dataToSearch.destination);
    } else {
        console.warn("Destination name not found in dataToSearch object.");
    }
    
    if (dataToSearch.departureDate) {
        const departureDate = new Date(dataToSearch.departureDate);
        departureDateElement.val(new Date(departureDate));
    }

    if (dataToSearch.returnDate) {
        const returnDate = new Date(dataToSearch.returnDate);
        returnDateElement.val(new Date(returnDate));
    }

    sessionStorage.removeItem("dataToSearch");
}

setDefaultValuesToSearchBar()
