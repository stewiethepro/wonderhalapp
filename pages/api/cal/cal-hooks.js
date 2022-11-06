import { buffer, text, json } from "micro";
import segmentClient from "@/utils/segment/segmentClient";
import { trackCalEvent } from "@/utils/segment/track";
import { getServiceSupabase } from "@/utils/supabase";

const analytics = segmentClient

const supabase = getServiceSupabase()

const calSecret = process.env.CAL_SIGNING_SECRET

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  const handler = async (req, res) => {
    if (req.method === "POST") {
      const event = await json(req);
      console.log(event);
        if (event.triggerEvent === 'BOOKING_CREATED') {
          console.log("Booking created");
          const eventTitle = event.payload.type + " Booked"
          const eventEmail = event.payload.attendees[0].email
          const eventName = event.payload.attendees[0].name.split(" ")
          const eventUserId = event.payload.metadata.a
          
          const eventProperties = { 
            name: event.payload.attendees[0].name,
            first_name: eventName[0],
            last_name: eventName[1],
          }

          trackCalEvent(analytics, eventTitle, eventUserId, eventEmail, eventProperties)
        } 
        if (event.triggerEvent === 'BOOKING_RESCHEDULED') {
          console.log("Booking rescheduled");
          const eventTitle = event.payload.type + " Rescheduled"
          const eventEmail = event.payload.attendees[0].email
          const eventName = event.payload.attendees[0].name.split(" ")
          
          const eventProperties = { 
            name: event.payload.attendees[0].name,
            first_name: eventName[0],
            last_name: eventName[1],
          }

          const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', event.payload.attendees[0].email)
          .single()

          if (profileError) {
            console.log(profileError);
          } else {
            console.log(profile);
          }

          const eventUserId = profile.id

          trackCalEvent(analytics, eventTitle, eventUserId, eventEmail, eventProperties)
        } 
        if (event.triggerEvent === 'BOOKING_CANCELLED') {
          console.log("Booking cancelled");
          const eventTitle = event.payload.type + " Cancelled"
          const eventEmail = event.payload.attendees[0].email
          const eventName = event.payload.attendees[0].name.split(" ")
          
          const eventProperties = { 
            name: event.payload.attendees[0].name,
            first_name: eventName[0],
            last_name: eventName[1],
          }

          const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', event.payload.attendees[0].email)
          .single()

          if (profileError) {
            console.log(profileError);
          } else {
            console.log(profile);
          }

          const eventUserId = profile.id

          trackCalEvent(analytics, eventTitle, eventUserId, eventEmail, eventProperties)
        } 
        res.status(200).end("Success");
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  };
  
  export default handler;