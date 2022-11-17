import { supabase } from "../../utils/supabase";
import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "../../components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import CardGridHomes from "@/components/cards/CardGridHomes";
import DashboardHeader from "@/components/header/DashboardHeader";
import { pages } from '@/utils/segment/constants/pages';
import { trackUserIdentify } from "@/utils/segment/track";


export default function Homes({data, headerContent}) {
    const { user, error } = useUser()
    const {profile, homes, homeApplications} = data

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
        <CardGridHomes data={homes} homeApplications={homeApplications}/>
      </>
    )
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/auth/sign-in',
    async getServerSideProps(ctx) {
      // Run queries with RLS on the server
      const { data: homes, error: homesError } = await supabaseServerClient(ctx)
      .from('homes_listed')
      .select('*, homes_images(*)')
      .order('id', { ascending: false })

      if (homesError) {
        console.log(homesError);
      } else {
        console.log(homes);
      }

      const { data: homeApplications, error: homeApplicationsError } = await supabaseServerClient(ctx)
      .from('home_applications')
      .select('*')

      if (homeApplicationsError) {
        console.log(homeApplicationsError);
      } else {
        console.log(homeApplications);
      }
      
      const { data: profile, error: profileError } = await supabaseServerClient(ctx)
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
            {name: "Apply", href: "/resident/apply", current: false},
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

      return { props: { data, navData, headerContent } };
    }
  });

  Homes.getLayout = getLayout;

  Homes.pageName = pages.homes.index.name
  Homes.pageCategory = pages.homes.index.category