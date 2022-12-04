import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import CardGridThree from "@/components/cards/CardGridThree";
import DashboardHeader from "@/components/header/DashboardHeader";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import AccountProfileForm from '@/components/forms/account/AccountProfileForm';
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';

export default function ResidentProfile({data, navData, headerContent, initialSession, sessionUser}) {
    const user = useUser();
    const { profile } = data
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
        <AccountProfileForm user={user} profile={profile}/>
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
          {name: "Dashboard", href: "/resident/dashboard", current: true},
          {name: "Resident application", href: "/resident/apply", current: false},
          {name: "Flatmates", href: "/resident/flatmates", current: false},
          {name: "Homes", href: "/homes", current: false},
      ],
      userNavigation: [
          {name: "My account", href: "/account", onClick: "#"},
          {name: "Settings", href: "/settings", onClick: "#"},
      ],
    }

    const headerContent = {
      title: "Profile", 
      main: "Hey " + data.profile.first_name + " 👋",
      description: "",
      button: "",
    }

      return { props: { data, navData, headerContent, initialSession, sessionUser } };
}

ResidentProfile.getLayout = getLayout;

ResidentProfile.pageName = pages.resident.dashboard.name
ResidentProfile.pageCategory = pages.resident.dashboard.category