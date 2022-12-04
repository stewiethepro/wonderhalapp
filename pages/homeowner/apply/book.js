import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import DashboardHeader from "@/components/header/DashboardHeader";
import Calendly from "@/components/booking/Calendly";
import CalScheduler from "@/components/booking/Cal";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';

export default function HomeownerApplyBook({data, navData, headerContent, initialSession, sessionUser}) {
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
        <DashboardHeader data={profile} headerContent={headerContent}/>
        {/* <Calendly/> */}
        <CalScheduler profile={profile} user={user} eventTypeLink="hamlet/homeowner-intro"/>
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
    title: "Hamlet intro", 
    main: "Book a video call",
    description: "Pick a date and time that work for you.",
  }

  return { props: { data, navData, headerContent, initialSession, sessionUser } };
}

  HomeownerApplyBook.getLayout = getLayout;

  HomeownerApplyBook.pageName = pages.homeowner.apply.book.name
  HomeownerApplyBook.pageCategory = pages.homeowner.apply.book.category
