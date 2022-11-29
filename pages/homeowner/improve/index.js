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
import CardGridOne from '@/components/cards/CardGridOne';

const card = {
  name: 'Arrange Setup',
  description: 'Click here to get started',
  imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/landing/smart-lock.png',
  imageAlt: 'Happy couple checking computer with lights in background',
  href: '/resident/apply/start',
  color: 'to-indigo-500',
  opacity: 'opacity-30',
}

export default function HomeownerImprove({data, navData, headerContent, initialSession, sessionUser}) {
    const user = useUser();
    const profile = data.profile

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

    return (
      <>  
        <DashboardHeader data={profile} headerContent={headerContent}/>

        <CardGridOne card={card}/>

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
      {name: "My Homes", href: "/homeowner/apply", current: true},
      {name: "Discover", href: "/discover", current: false},
      {name: "Chat", href: "/chat", current: false},
    ],
    userNavigation: [
        {name: "My account", href: "/account", onClick: "#"},
        {name: "Settings", href: "/settings", onClick: "#"},
  ],
  }

  const headerContent = {
    title: "Hamlet Smart Locks", 
    main: "A smarter, more convenient home",
    description: "Always know your home is safe and sound with monitoring, revokable access and bank-level security.",
  }

  return { props: { data, navData, headerContent, initialSession, sessionUser } };

}


HomeownerImprove.getLayout = getLayout;

HomeownerImprove.pageName = pages.resident.apply.book.name
HomeownerImprove.pageCategory = pages.resident.apply.book.category
