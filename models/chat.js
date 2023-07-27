require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
 
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
 
 
const openai = new OpenAIApi(configuration);

 
const checkIt = async (question) => {
  let messages = [
        { role: 'user', content: question }
      ];
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages
    });
    //console.log(completion.data);
    return (completion.data.choices[0].message);
 
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}
 
module.exports = checkIt
