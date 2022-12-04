import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect, Fragment } from 'react'
import { useRouter } from "next/router";
import Link from 'next/link';
import { getLayout } from "@/components/layout/AppLayout";
import DashboardHeader from "@/components/header/DashboardHeader";
import Calendly from "@/components/booking/Calendly";
import CalScheduler from "@/components/booking/Cal";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import { SparklesIcon } from '@heroicons/react/20/solid'
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';

export default function ViewHomeInPerson({data, navData, headerContent, initialSession, sessionUser}) {
    const user = useUser();
    const { boot, shutdown, hide, show, update } = useIntercom();
    const { homes, profile } = data
    const home = homes[0]
    const homeId = home.id
    console.log(homeId);

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

      updateIntercom(user, profile, update)
      
    }
  }, [])

    return (
      <>  
        <DashboardHeader data={profile} headerContent={headerContent}/>

        <div className="flex-shrink-0 my-auto -mt-4 mb-4">
          <Link href={"/homes/" + homeId + "/view/online/"}>
            <button className='inline-flex relative items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-indigo-500 bg-indigo-100 hover:bg-indigo-200 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              View online in 3D?
              <span className="flex h-3 w-3">
                  <span className="animate-ping absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="absolute -top-1 -right-1 inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
              <SparklesIcon
                className="ml-2 h-5 w-5 flex-shrink-0 text-indigo-500"
                aria-hidden="true"
              />
            </button>
          </Link>
        </div>
        
        <CalScheduler profile={profile} user={user} eventTypeLink={"hamlet/view-" + homeId}/>
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

  const homeId = ctx.query.homeId

  // Run queries with RLS on the server
  const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .single();

  // Run queries with RLS on the server
  const { data: homes, error: homesError } = await supabase
  .from('homes_listed')
  .select('*, homes_images(*)')
  .eq('id', homeId)

  if (homesError) {
    console.log(homesError);
  } else {
    console.log(homes);
  }

  const data = { profile, homes }

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

  const streetAddress = homes[0].street_address 

  const headerContent = {
    title: "In-person viewing", 
    main: streetAddress,
    description: "If you can't find a time that works, get in touch with us and we'll see what we can do.",
  }
  
  return { props: { data, navData, headerContent, initialSession, sessionUser } };

}


ViewHomeInPerson.getLayout = getLayout;

ViewHomeInPerson.pageName = pages.homes.home.view.inPerson.name
ViewHomeInPerson.pageCategory = pages.homes.home.view.inPerson.category
