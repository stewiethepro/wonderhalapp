import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import DashboardHeader from "@/components/header/DashboardHeader";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import { get, post } from '@/utils/api/request';
import { resolveHref } from 'next/dist/shared/lib/router/router';


export default function PayAuthorise({data, navData, headerContent, initialSession, sessionUser}) {
    const user = useUser();
    const profile = data.profile
    const customer = {
        given_name: profile.first_name,
        family_name: profile.last_name,
        email: profile.email,
    }
        
  useEffect(() => {

    if (user && profile) {

      const traits = {
        id: user.id, 
        email: user.email, 
        name: profile.first_name + " " + profile.last_name,
        first_name: profile.first_name,
        last_name: profile.last_name,
        user_type: profile.user_type
      }

      trackUserIdentify(traits)
    }
  }, [])

  function preparePayloads(profile) {

    const billingRequestPayload = {
        user_id: profile.id,
      }
  
    return {
      billingRequestPayload: billingRequestPayload,
    }
  }

  async function getGoCardlessCustomers(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/gocardless/customers/get', request).then((result) => {
                const data = result;
                console.log("API result: ", data);
                resolve(data);
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error);
        }
      })()
    })
  }

  async function createGoCardlessBillingRequest(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/gocardless/billing-request/post', request).then((result) => {
                const data = result;
                console.log("API result: ", data);
                resolve(data);
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error);
        }
      })()
    })
  }

  async function createGoCardlessBillingRequestFlow(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/gocardless/billing-request-flow/post', request).then((result) => {
                const data = result;
                console.log("API result: ", data);
                resolve(data);
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error);
        }
      })()
    })
  }

  async function createGoCardlessSubscription(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/gocardless/subscriptions/post', request).then((result) => {
                const data = result;
                console.log("API result: ", data);
                resolve(data);
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error);
        }
      })()
    })
  }

  async function getAkahuAccounts(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await get('/api/akahu/get', request).then((result) => {
                const data = result;
                console.log("API result: ", data);
                resolve(data);
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error);
        }
      })()
    })
  }


  async function startGoCardlessMandateFlow(customer) {

    return new Promise(resolve => {
  
        (async () => {

            const {
              billingRequestPayload
            } = preparePayloads(profile)
    
            console.log({
                billingRequestPayload: billingRequestPayload,
            });

            let billingRequest = "";
          
            try {
                const mandate = await createGoCardlessBillingRequest(billingRequestPayload);
                console.log("mandate: ", mandate);
                billingRequest = mandate.id
            } catch (error) {
                console.log("error: ", error);
                resolve(error)
            }
  
            try {
                let payload = {
                    customer: customer,
                    billingRequest: billingRequest
                }
                const billingRequestFlow = await createGoCardlessBillingRequestFlow(payload);
                console.log("billingRequestFlow: ", billingRequestFlow);
                alert('Approve now: ' + billingRequestFlow.authorisation_url)
            } catch (error) { 
                console.log("error: ", error);
                resolve(error)
            }
  
            resolve("success")
  
          })();
  
    })
  
  }

    return (
      <>  
        <DashboardHeader data={profile} headerContent={headerContent}/>

        <span className="isolate inline-flex rounded-md shadow-sm">
        <button
            type="button"
            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onClick={() => startGoCardlessMandateFlow(customer)}
        >
            Start GC Flow
        </button>
        <button
            type="button"
            className="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onClick={() => getAkahuAccounts()}
        >
            Get Akahu Accounts
        </button>
        <button
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onClick={() => getGoCardlessCustomers()}
        >
            Get GC Customers
        </button>
        </span>
      </>
    )
}

export const getServerSideProps = async (ctx) =>{

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    }

  const initialSession = session
  const sessionUser = session.user

  // Run queries with RLS on the server
  const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .single();

  const data = { profile }

  const navData = {
    navigation: [
      {name: "Dashboard", href: "/resident/dashboard", current: false},
      {name: "Resident application", href: "/resident/apply", current: true},
      {name: "Flatmates", href: "/resident/flatmates", current: false},
      {name: "Homes", href: "/homes", current: false},
    ],
    userNavigation: [
        {name: "My account", href: "/account", onClick: "#"},
        {name: "Settings", href: "/settings", onClick: "#"},
    ],
  }

  const headerContent = {
    title: "Hamlet Pay", 
    main: "Set up your rent payments",
    description: "We partner with GoCardless to bring your rent payments into the 21st century.",
  }

  return { props: { data, navData, headerContent, initialSession, sessionUser } };

}

PayAuthorise.getLayout = getLayout;

PayAuthorise.pageName = pages.resident.apply.book.name
PayAuthorise.pageCategory = pages.resident.apply.book.category
