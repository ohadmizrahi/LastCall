function formatCityName(city) {
    const trimmedCity = city.trim();
    const formattedCity = trimmedCity.replace(/-/g, ' ');
    const titleCaseCity = formattedCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return titleCaseCity;
  }

  function formatAirportName(airportName, addSuffix) {
    const trimmedName = airportName.trim();
    const formattedName = trimmedName.replace(/"/g, '');
    let titleCaseName = formattedName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    if (addSuffix) {
      titleCaseName = titleCaseName + " " + "Airport"
    }
  
    return titleCaseName;
  }

  function formatDate(date) {
    const dateTime = new Date(date)
    const timeOffest = dateTime.getTimezoneOffset()
    const formattedDate = dateTime.setMinutes(dateTime.getMinutes() + (-timeOffest)) 
    return new Date(formattedDate)
    
}

module.exports.formatCityName = formatCityName
module.exports.formatAirportName = formatAirportName
module.exports.formatDate = formatDate