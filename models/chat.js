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
    console.log(question);
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    console.log("Chat response successfully");
    return (chatCompletion.data.choices[0].message.content);
 
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}
 
module.exports=askGPT

