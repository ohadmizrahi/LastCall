require('dotenv').config()
const axios = require("axios");
const askGPT = require("./chat.js")

const destinations = [{
    name: "Barcelona",
    country: "Spain",
    bestMonth: "July",
    avgRank: "6.7",
    img: "https://api.time.com/wp-content/uploads/2023/03/Worlds-Greatest-Places-Barcelona-Spain.jpg",
    description: "Barcelona, Spain's vibrant capital of Catalonia, blends rich history with modern creativity, showcasing iconic architectural wonders by Antoni Gaudí. Its lively cultural scene, picturesque beaches, and thriving nightlife make it a captivating destination for travelers worldwide."
}, 
{
    name: "Paris",
    country: "France",
    bestMonth: "April",
    avgRank: "8.4",
    img: "https://res.klook.com/image/upload/Mobile/City/swox6wjsl5ndvkv5jvum.jpg" ,
    description: "Paris, the romantic capital of France, enthralls visitors with its timeless beauty and iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. Immerse in its art, culture, and exquisite cuisine, while strolling along charming streets and experiencing the city's unmistakable allure."
}, 
{
    name: "Tel Aviv",
    country: "Israel",
    bestMonth: "August",
    avgRank: "9.6",
    img: "https://f6h8q2y9.stackpathcdn.com/wp-content/uploads/2020/02/Beach-1024x682.jpg",
    description: "Tel Aviv, the cosmopolitan hub of Israel, beckons travelers with its sunny Mediterranean beaches, modern architecture, and thriving cultural scene. Explore its dynamic art galleries, indulge in diverse culinary delights, and immerse yourself in the city's energetic spirit. Tel Aviv's unique blend of ancient history and contemporary charm creates an alluring destination for visitors seeking an enriching and unforgettable urban experience."
}, 
{
    name: "Buenos Aires",
    country: "Argentina",
    bestMonth: "November",
    avgRank: "7.5",
    img: "https://earth5r.org/wp-content/uploads/2020/08/Mumbai-India-Environmental-NGO-Earth5R-BUENOS-AIRES-Sustainability-through-circular-economyjpg.jpg",
    description: "Buenos Aires, the vibrant capital of Argentina, captivates with its rich culture, tango music, and historic architecture. This bustling metropolis boasts an array of world-class theaters, museums, and trendy neighborhoods, making it a lively hub for art, food, and entertainment. Explore its colorful streets, savor delectable Argentine cuisine, and immerse yourself in the city's passionate spirit."
},
{
    name: "New York City",
    country: "United State",
    bestMonth: "November",
    avgRank: "8.5",
    img: "https://static.independent.co.uk/2023/07/05/16/iStock-1277102943.jpg",
    description: "New York City, the bustling metropolis in the USA, is an iconic blend of culture, architecture, and diversity. Known for its famous landmarks such as the Statue of Liberty, Times Square, and Central Park, the city offers a vibrant arts scene, world-class dining, and endless entertainment options, making it a captivating destination for visitors from around the globe."
}
]
function getDestinations() {
    return destinations
}

async function addDestinations(destination) {
    destination.img = await getDestImg(destination.name)
    destinations.push(destination)
}

async function getDestImg(destinationName) {
    const apiKey = process.env.UNSPLASH_KEY;

        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos?query=${destinationName}&client_id=${apiKey}`);;
            const imageUrl = response.data.results[0]?.urls?.regular || '/images/placeholder.jpg'; // Use a placeholder if no image is found
            return imageUrl
        } catch (error) {
            console.error('Error fetching image:', error);
        }
}

async function generateTourismData(dest) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const tourismData = [];

    months.forEach((month) => {

        const tourists = Math.floor(Math.random() * 1000) + 500;

        if (month === dest.bestMonth) {
            tourismData.push({ month, tourists: 1450 });
        } else {
            tourismData.push({ month, tourists:  Math.floor(tourists*0.75) });
        }
    });

    return tourismData;
}

async function getRecomandationFromGPT(data) {
    const prompt = `
    I need a Destination Recomandation based on the following data.
    The data is:
    Travel Style is ${data.travelStyle}, Prefered Season is ${data.seasonPreference}, Total number of travelers is ${parseInt(data.adults, 10) + parseInt(data.kids, 10)}
    Number of Adults is ${data.adults}, Number of kids is ${data.kids}, Total vacation duration is ${data.duration}, Budget range is between ${data.minBudget} to ${data.maxBudget}
    The main interests for the vacation are ${data.selectedInterests[0], data.selectedInterests[1], data.selectedInterests[2]}, And ${data.uniqueDestinations} unique destinations.
    Please אake into account flights, hotels and attractions prices when choosing the destination
    Please return answer build as a json with: 
    First parameter called destination holdin the Destination name and country. 
    Second parameter called description holding the Description over the destionation.`
    
    const recomandationString = await askGPT(prompt);
    const recomandation = JSON.parse(recomandationString);
    console.log(recomandation);


    return recomandation

}


module.exports.getDestinations = getDestinations
module.exports.addDestinations = addDestinations
module.exports.getDestImg = getDestImg
module.exports.generateTourismData = generateTourismData
module.exports.getRecomandationFromGPT = getRecomandationFromGPT