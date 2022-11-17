import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import DashboardHeader from "@/components/header/DashboardHeader";
import FlatmatesList from '@/components/lists/FlatmatesList';
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";

export default function Flatmates({data, navData, headerContent}) {
    const { user, error } = useUser();
    const { profile, flatmates, residentGroups } = data

    console.log(flatmates, residentGroups);

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
        <DashboardHeader user={user} data={profile} headerContent={headerContent}/>
        
        {user? 
        <>
        <FlatmatesList people={flatmates} groups={residentGroups} user={user} profileData={profile}/>
        </>
        :
        <>
        </>
        }
      </>
    )
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/auth/sign-in',
    async getServerSideProps(ctx) {
      // Run queries with RLS on the server
      const { data: profile, error: profileError } = await supabaseServerClient(ctx)
      .from('profiles')
      .select('*')
      .single();

      if (profileError) {
        console.log(profileError);
      } else {
        console.log(profile);
      }

      const { data: flatmates, error: flatmatesError } = await supabaseServerClient(ctx)
      .from('resident_group_members')
      .select('*')

      if (flatmatesError) {
        console.log(flatmatesError);
      } else {
        console.log(flatmates);
      }

      const { data: residentGroups, error: residentGroupsError } = await supabaseServerClient(ctx)
      .from('resident_groups')
      .select('*')

      if (residentGroupsError) {
        console.log(residentGroupsError);
      } else {
        console.log(residentGroups);
      }

      const data = { profile, flatmates, residentGroups }

      const navData = {
        navigation: [
            {name: "Dashboard", href: "/resident/dashboard", current: false},
            {name: "Apply", href: "/resident/apply", current: false},
            {name: "Flatmates", href: "/resident/flatmates", current: true},
            {name: "Homes", href: "/homes", current: false},
        ],
        userNavigation: [
            {name: "My account", href: "/account", onClick: "#"},
            {name: "Settings", href: "/settings", onClick: "#"},
        ],
      }

    const headerContent = {
      title: "Flatmates", 
      main: "Your group",
      description: "Good flatmates are hard to find, harder to leave and impossible to forget.",
      button: "",
    }

      return { props: { data, navData, headerContent } };
    }
  });

Flatmates.getLayout = getLayout;

Flatmates.pageName = pages.resident.flatmates.index.name
Flatmates.pageCategory = pages.resident.flatmates.index.category