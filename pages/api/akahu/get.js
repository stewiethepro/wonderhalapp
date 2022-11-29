import { buffer, text, json } from "micro";
import { getAccounts } from "@/utils/akahu";
  
  const handler = async (req, res) => {
    const request = req.query

    if (req.method === "GET") {
        try {
            const data = await getAccounts()
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