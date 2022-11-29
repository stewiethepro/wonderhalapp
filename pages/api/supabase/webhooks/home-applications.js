import { buffer, text, json } from "micro";
import segmentClient from "@/utils/segment/segmentClient";
import { getServiceSupabase } from "@/utils/supabase";

const analytics = segmentClient

const supabase = getServiceSupabase()

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  const handler = async (req, res) => {
    if (req.method === "POST") {
      const event = await json(req);
      console.log(event); 
        res.status(200).end("Success");
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  };
  
  export default handler;