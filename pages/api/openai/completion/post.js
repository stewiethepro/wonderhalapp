import { buffer, text, json } from "micro";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
  
const handler = async (req, res) => {
  const {prompt} = req.body
  console.log("prompt: ", prompt);

  if (req.method === "POST") {
      try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 1,
            max_tokens: 200,
            top_p:0.3,
            frequency_penalty:0.5,
            presence_penalty:0.0
        });
        console.log(response);
        res.status(200).json(response.data)
      } catch (error) {
          res.status(500).json({error: error, message: error.message})
      }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;