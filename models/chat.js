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
 
module.exports=askGPT

