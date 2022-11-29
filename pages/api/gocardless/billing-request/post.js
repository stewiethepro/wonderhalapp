import { buffer, text, json } from "micro";
import segmentClient from "@/utils/segment/segmentClient";
import { getServiceSupabase } from "@/utils/supabase";
import { createGoCardlessBillingRequest } from "@/utils/gocardless";

const analytics = segmentClient

const supabase = getServiceSupabase()
  
const handler = async (req, res) => {
  const request = req.body

  if (req.method === "POST") {
      try {
          const data = await createGoCardlessBillingRequest(request)
          console.log(data);
          res.status(200).json(data)
      } catch (error) {
          res.status(500).json({error: error, message: error.message})
      }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;