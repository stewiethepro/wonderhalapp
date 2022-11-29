import { buffer, text, json } from "micro";
import segmentClient from "@/utils/segment/segmentClient";
import { getServiceSupabase } from "@/utils/supabase";
import { createGoCardlessBillingRequestFlow } from "@/utils/gocardless";

const analytics = segmentClient

const supabase = getServiceSupabase()
  
  const handler = async (req, res) => {
    const request = req.body
    const billingRequest = request.billingRequest
    const customer = request.customer

    if (req.method === "POST") {
        try {
            const data = await createGoCardlessBillingRequestFlow(customer, billingRequest)
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