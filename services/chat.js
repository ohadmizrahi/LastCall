require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const askGPT = async (question) => {
  let messages = [{ role: 'system', content: question }];

  try {
    console.log("Asking Chat ...");
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    const chatAnswer = chatCompletion.data.choices[0].message.content
    if (chatAnswer) {
    console.log("Chat response successfully");
    return { answer: chatAnswer, status: 0 };
    } else {
      return { status: 1 }
    }
 
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
    return { status: 2 }
  }
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
 
module.exports.askGPT = askGPT
module.exports.getRecomandationFromGPT = getRecomandationFromGPT
module.exports.destinationDataFromChat = destinationDataFromChat

