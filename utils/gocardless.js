import gocardless from 'gocardless-nodejs'
import * as constants from 'gocardless-nodejs/constants'
import { get } from './api/request';

export const client = gocardless(
  // We recommend storing your access token in an environment
  // variable for security
  process.env.GO_CARDLESS_ACCESS_TOKEN,
  // Change this to constants.Environments.Live when you're ready to go live
  constants.Environments.Sandbox
);

export async function getGoCardlessCustomer() {
    return new Promise(resolve => {
        (async () => {
        try {
            console.log("getGoCardlessCustomer called");         
            const listResponse = await client.customers.list();
            const customers = listResponse.customers;
            console.log("customers: ", customers);
            resolve(customers)
        } catch (error) {
            console.log("error: ", error);
            resolve(error)
        }
        })()
    })
}

export async function createGoCardlessBillingRequest(metadata) {
    return new Promise(resolve => {
        (async () => {
        try {
            console.log("createGoCardlessBillingRequest called");         
            const billingRequest = await client.billingRequests.create({
                mandate_request: {
                    currency: "NZD",
                    metadata: metadata,
                },
            });
            console.log("billingRequest: ", billingRequest);
            resolve(billingRequest)
        } catch (error) {
            console.log("error: ", error);
            resolve(error)
        }
        })()
    })
}

export async function createGoCardlessBillingRequestFlow(customer, billingRequest) {
    return new Promise(resolve => {
        (async () => {
        try {
            console.log("createGoCardlessBillingRequestFlow called");         
            const billingRequestFlow = await client.billingRequestFlows.create({
                redirect_uri: "https://dev.stayhamlet.com/resident/pay/rent/confirm",
                exit_uri: "https://dev.stayhamlet.com/resident/pay/rent/unsuccessful",
                prefilled_customer: {
                    given_name: customer.given_name,
                    family_name: customer.family_name,
                    email: "petersloan1984+test7@gmail.com",
                },
                lock_currency: true,
                links: {
                    billing_request: billingRequest,
                },
            });
            console.log("billingRequestFlow: ", billingRequestFlow);
            resolve(billingRequestFlow)
        } catch (error) {
            console.log("error: ", error);
            resolve(error)
        }
        })()
    })
}

export async function createGoCardlessSubscription(mandate) {
    return new Promise(resolve => {
        (async () => {
        try {
            console.log("createGoCardlessSubscription called");         
            const subscription = await client.subscriptions.create(
                {
                  amount: 150000,
                  currency: "NZD",
                  name: "Hamlet Rent",
                  interval: 2,
                  interval_unit: "weekly",
                  retry_if_possible: true,
                  links: {
                    mandate: mandate
                  }
                },
                "unique_subscription_specific_string"
            );
            console.log("subscription: ", subscription);
            resolve(subscription)
        } catch (error) {
            console.log("error: ", error);
            resolve(error)
        }
        })()
    })
}