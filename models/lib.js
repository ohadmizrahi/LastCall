function formatCityName(city) {
    const trimmedCity = city.trim();
    const formattedCity = trimmedCity.replace(/-/g, ' ');
    const titleCaseCity = formattedCity
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  
    return titleCaseCity;
  }

module.exports.formatCityName = formatCityName