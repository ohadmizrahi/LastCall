require('dotenv').config()
const mongoose = require('mongoose');
const axios = require("axios");
const askGPT = require("./chat.js")

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    bestMonth: {
        type: String,
        required: true
    },
    avgRank: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    searches: {
        type: Number,
        default: 0
    }
});

const Destination = mongoose.model('Destination', destinationSchema);

async function findDestinations(query = null) {
    try {
        if (query) {
            console.log("Looking for destinations...");
            const destinations = await Destination.find(query)
            return destinations

        } else {
            console.log("Getting all destinations...");
            const destinations = await Destination.find()
            return destinations

        }
    }
    catch (error) {
        console.error("Error: error trying to find destinations", error)
    }
}

async function updateDestination(destName, fieldToUpdate, newValue) {
    try {
        const filter = { name: destName };
        let update;

        if (newValue === "+1") {
            update = { $inc: { [fieldToUpdate]: 1 } };
        } else {
            update = { [fieldToUpdate]: newValue };
        }

        const options = { new: true };
        const newDestination = await Destination.findOneAndUpdate(filter, update, options);

        if (newDestination) {
            console.log(`${newDestination.name} has been updated`);
            return newDestination;
        } else {
            console.log(`No destination found with name ${destName}.`);
            return false;
        }
    } catch (error) {
        console.error("Error: error trying to update destinations", error);
        return false;
    }
}


async function insertNewDestinations(destinationsDataArray) {
    try {
        console.log("Start inserting new destinations");
        let insertCount = 0

        for (const data of destinationsDataArray) {

            const {
                name: name,
                country: country,
                bestMonth: bestMonth,
                avgRank: avgRank,
                img: img,
                description: description 
            } = data;

            const searches = data.searches ? data.searches : 0;

            const existingDestination = await Destination.findOne({
                'name': name,
            });

            if (!existingDestination) {

                console.log(`Creating new destination ${name}`);

                const newDestination = new Destination({
                    name: name,
                    country: country,
                    bestMonth: bestMonth,
                    avgRank: avgRank,
                    img: img,
                    description: description,
                    searches: searches
                })

                await newDestination.save();
                insertCount++
            } else {
                console.log(`Destination ${name} is already exist`);
            }
        }

        console.log(`${insertCount} new destinations inserted to DB`)
    } catch (error) {
        throw new Error('Error finding or creating destinations: ' + error.message);
    }
}

async function getPopularDestinations() {
    const destinations = await findDestinations()
    destinations.sort((a, b) => b.searches - a.searches);
    const top6Searches = destinations.slice(0, 6);

    return top6Searches
}

async function updateDestinationsPopularity(destination) {

    console.log(`Start updating ${destination.name}`);
    const newDestination = await updateDestination(destination.name, "searches", "+1");

    if (newDestination) {
        return newDestination
    } else {
        if (!destination.avgRank) {
            destination.avgRank = Number((Math.random() * (10 - 5) + 5).toFixed(1))
        }
        if (!destination.avgRank) {
            destination.avgRank = Number((Math.random() * (10 - 5) + 5).toFixed(1))
        }
        if (!destination.description) {
            const destData = await getDataOverDestFromChat(destination.name)
            destination.country = destData.country
            destination.description = destData.description
            destination.bestMonth = destData.bestMonth
        }
        destination.img = await getDestImg(destination.name);
        destination.searches = 1;
        await insertNewDestinations([destination])
        return destination
    }
}


async function getDestImg(destinationName) {
    const apiKey = process.env.UNSPLASH_KEY;

    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${destinationName}&client_id=${apiKey}`);;
        const imageUrl = response.data.results[0]?.urls?.regular || '/images/placeholder.jpg';
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
            tourismData.push({ month, tourists: Math.floor(tourists * 0.75) });
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
    Please take into account flights, hotels and attractions prices when choosing the destination
    Please verify yourself if the destination is unique or not
    Please return answer build as a json with: 
    First parameter called name holdin the Destination name, please make sure it always a city name.
    Second parameter called country holding the country of the selected destination.
    Third parameter called bestMonth holding the recomended month to visit this destination, verify its a calender month. 
    and Last parameter called description holding the Description over the destionation.`

    const recomandationString = await askGPT(prompt);
    const recomandation = JSON.parse(recomandationString);
    console.log(recomandation);


    return recomandation

}

async function getDataOverDestFromChat(destName) {
    const prompt = `
    Please return answer build as a json with: 
    First parameter called country holding the country of the selected destination.
    Second parameter called bestMonth holding the recomended month to visit this destination, verify its a calender month. 
    and Last parameter called description holding the Description over the destionation.
    The Destination is ${destName}.
    `
    const destDataString = await askGPT(prompt);
    const destData = JSON.parse(destDataString);
    console.log(destData);

    return destData

}


module.exports.getPopularDestinations = getPopularDestinations
module.exports.updateDestinationsPopularity = updateDestinationsPopularity
module.exports.updateDestination = updateDestination
module.exports.getDestImg = getDestImg
module.exports.generateTourismData = generateTourismData
module.exports.getRecomandationFromGPT = getRecomandationFromGPT
module.exports.findDestinations = findDestinations
module.exports.getDataOverDestFromChat = getDataOverDestFromChat