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

module.exports.formatCityName = formatCityName
module.exports.formatAirportName = formatAirportName