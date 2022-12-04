import { buffer, text, json } from "micro";
import { createIntercomSignature } from "@/utils/intercom";

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  const handler = async (req, res) => {
    const { userId } = req.query
    if (req.method === "GET") {
        try {
            const data = createIntercomSignature(userId)
            console.log(data);
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({error: error, message: error.message})
        }
    } else {
      res.setHeader("Allow", "GET");
      res.status(405).end("Method Not Allowed");
    }
  };
  
  export default handler;