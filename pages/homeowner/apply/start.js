import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { getLayout } from "@/components/layout/AppLayout";
import HomeownerApplicationForm from "@/components/forms/homeowner/apply/HomeownerApplicationForm";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';

export default function HomeownerApplyStart({data, navData, headerContent, initialSession, sessionUser}) {
    const user = useUser();
    const profile = data.profile
    const { boot, shutdown, hide, show, update } = useIntercom();


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
        <HomeownerApplicationForm user={user} profileData={profile}/>
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
        {name: "Dashboard", href: "/homeowner/dashboard", current: false},
        {name: "Apply", href: "/homeowner/apply", current: true},
        {name: "Discover", href: "/discover", current: false},
        {name: "Chat", href: "/chat", current: false},
    ],
    userNavigation: [
        {name: "My account", href: "/account", onClick: "#"},
        {name: "Settings", href: "/settings", onClick: "#"},
    ],
}

  const headerContent = {
    title: "Homeowner Application", 
    main: "We just need a few details",
    description: "This shouldn't take more than 5-10 mins, we've broken it up into nice little steps.",
    button: {
      title: "Start",
      href: "/homeowner/apply/start",
    }
  }

  return { props: { data, navData, headerContent, initialSession, sessionUser } };
}

  HomeownerApplyStart.getLayout = getLayout;

  HomeownerApplyStart.pageName = pages.homeowner.apply.start.name
  HomeownerApplyStart.pageCategory = pages.homeowner.apply.start.category