const Destination = require("./destinationModel")
require('dotenv').config()
const axios = require("axios");
const askGPT = require("../chat.js")


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
        console.log(`Start updating ${destName}`);
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
            const { destData } = await destinationDataFromChat(destination.name)
            console.log();
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
        console.log(`Look for representitive image for ${destinationName}`);
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${destinationName}&client_id=${apiKey}`);;
        const imageUrl = response.data.results[0]?.urls?.regular
        return imageUrl
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

async function generateTourismData(destination) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const tourismData = [];
    console.log(`Generating tourism data for${destination}`);
    months.forEach((month) => {

        const tourists = Math.floor(Math.random() * 1000) + 500;

        if (month === destination.bestMonth) {
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
    First parameter called name holding the Destination name, please make sure it always a city name.
    Second parameter called country holding the country of the selected destination.
    Third parameter called bestMonth holding the recomended month to visit this destination, verify its a calender month. 
    and Last parameter called description holding the Description over the destionation.`
    
    let response;
    const chatResponse = await askGPT(prompt);
    if (chatResponse.status == 0) {
    const recomandation = JSON.parse(chatResponse.answer);
    response = { status: chatResponse.status, recomandation: recomandation }
    } else {
        response = { status: chatResponse.status }
    }

    return response

}

async function destinationDataFromChat(destName) {
    const prompt = `
    Please return answer build as a json with: 
    First parameter called country holding the country of the selected destination.
    Second parameter called bestMonth holding the recomended month to visit this destination, verify its a calender month. 
    and Last parameter called description holding the Description over the destionation.
    The Destination is ${destName}.
    `

    let response;
    const chatResponse = await askGPT(prompt);
    if (chatResponse.status == 0) {
    const destData = JSON.parse(chatResponse.answer);
    response = { status: chatResponse.status, destData: destData }
    } else {
        response = { status: chatResponse.status }
    }

    return response

}


module.exports.getPopularDestinations = getPopularDestinations
module.exports.updateDestinationsPopularity = updateDestinationsPopularity
module.exports.updateDestination = updateDestination
module.exports.getDestImg = getDestImg
module.exports.generateTourismData = generateTourismData
module.exports.getRecomandationFromGPT = getRecomandationFromGPT
module.exports.findDestinations = findDestinations
module.exports.destinationDataFromChat = destinationDataFromChat