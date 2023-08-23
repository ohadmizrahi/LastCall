require('dotenv').config()
const axios = require("axios");


async function getDestImg(destinationName) {
    const apiKey = process.env.UNSPLASH_KEY;

    try {
        console.log(`Look for representitive image for ${destinationName}`);
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${destinationName}&client_id=${apiKey}`);;
        const imageUrl = response.data.results[0]?.urls?.regular
        return imageUrl
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

module.exports.getDestImg = getDestImg