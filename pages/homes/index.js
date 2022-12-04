import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "../../components/layout/AppLayout";
import CardGridHomes from "@/components/cards/CardGridHomes";
import DashboardHeader from "@/components/header/DashboardHeader";
import { pages } from '@/utils/segment/constants/pages';
import { trackUserIdentify } from "@/utils/segment/track";
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';


export default function Homes({data, headerContent, initialSession, sessionUser}) {
    const user = useUser()
    const {profile, homes, homeApplications} = data
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
        <DashboardHeader user={user} data={profile} headerContent={headerContent}/>
        <CardGridHomes data={homes} homeApplications={homeApplications}/>
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
  const { data: homes, error: homesError } = await supabase
  .from('homes_listed')
  .select('*, homes_images(*)')
  .order('id', { ascending: false })

  if (homesError) {
    console.log(homesError);
  } else {
    console.log(homes);
  }

  const { data: homeApplications, error: homeApplicationsError } = await supabase
  .from('home_applications')
  .select('*')

  if (homeApplicationsError) {
    console.log(homeApplicationsError);
  } else {
    console.log(homeApplications);
  }
  
  const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .single();

  if (profileError) {
    console.log(profileError);
  } else {
    console.log(profile);
  }

  const data = {homes, homeApplications, profile}

  const navData = {
    navigation: [
        {name: "Dashboard", href: "/resident/dashboard", current: false},
        {name: "Resident application", href: "/resident/apply", current: false},
        {name: "Flatmates", href: "/resident/flatmates", current: false},
        {name: "Homes", href: "/homes", current: true},
    ],
    userNavigation: [
        {name: "My account", href: "/account", onClick: "#"},
        {name: "Settings", href: "/settings", onClick: "#"},
    ],
  }

  const headerContent = {
    title: "Find your home", 
    main: "Homes",
    description: "Check out some of our Hamlet homes",
    button: "",
  }

  return { props: { data, navData, headerContent, initialSession, sessionUser } };
}

  Homes.getLayout = getLayout;

  Homes.pageName = pages.homes.index.name
  Homes.pageCategory = pages.homes.index.category