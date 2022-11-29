const webhooks = require("gocardless-nodejs/webhooks");

const webhookEndpointSecret = process.env.GO_CARDLESS_WEBHOOK_SECRET;

export const config = {
    api: {
      bodyParser: {
        type: textjson
      },
    },
  }

const processMandate = (event) => {
  /*
   You should keep some kind of record of what events have been processed
   to avoid double-processing, checking if the event already exists
   before processing it.

   You should perform processing steps asynchronously to avoid timing out
   if you receive many events at once. To do this, you could use a
   queueing system like
   # Bull https://github.com/OptimalBits/bull

   Once you've performed the actions you want to perform for an event, you
   should make a record to avoid accidentally processing the same one twice
 */

  switch(event.action) {
    case "cancelled":
      return `Mandate ${event.links.mandate} has been cancelled.\n`;
    default:
      return `Do not know how to process an event with action ${event.action}`;
 }
}

const processEvent = (event) => {
  switch(event.resource_type) {
    case "mandates": 
      return processMandate(event);
    default:
      return `Do not know how to process an event with resource_type ${event.resource_type}`;
  }
}

app.post("/", async (req, res) => {
  const eventsRequestBody = req.body;
  const signatureHeader = req.headers['Webhook-Signature'];

  // Handle the incoming Webhook and check its signature.
  const parseEvents = (
    eventsRequestBody,
    signatureHeader // From webhook header
  ) => {
    try {
      return webhooks.parse(
        eventsRequestBody,
        webhookEndpointSecret,
        signatureHeader
      );
    } catch (error) {
      if (error instanceof webhooks.InvalidSignatureError) {
        console.log("invalid signature, look out!");
      }
    }
  };

  try {
    const events = parseEvents(eventsRequestBody, signatureHeader);
    let responseBody = ""
    for(const event of events) {
      responseBody += processEvent(event)
    }
  
    res.send(responseBody);
  } catch(error) {
    res.status(400).send({error: error.message});
  }
})

app.listen(process.env.PORT, () => {
  console.log(`server started on port: ${process.env.PORT}`);
})
