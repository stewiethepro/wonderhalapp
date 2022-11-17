import { supabase } from "@/utils/supabase";
import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import DashboardHeader from "@/components/header/DashboardHeader";
import Calendly from "@/components/booking/Calendly";
import CalScheduler from "@/components/booking/Cal";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";

export default function HomeownerApplyBook({data, navData, headerContent}) {
    const { user, error } = useUser();
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
        {/* <Calendly/> */}
        <CalScheduler profile={profile} user={user} eventTypeLink="hamlet/resident-intro"/>
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

      const data = { profile }

      const navData = {
        navigation: [
          {name: "Dashboard", href: "/resident/dashboard", current: false},
          {name: "Apply", href: "/resident/apply", current: true},
          {name: "Flatmates", href: "/resident/flatmates", current: false},
          {name: "Homes", href: "/homes", current: false},
        ],
        userNavigation: [
            {name: "My account", href: "/account", onClick: "#"},
            {name: "Settings", href: "/settings", onClick: "#"},
        ],
    }

      const headerContent = {
        title: "Hamlet intro", 
        main: "Book an optional video call",
        description: "If you have the time we'd love to meet you.",
      }

      return { props: { data, navData, headerContent } };
    }
  });

  HomeownerApplyBook.getLayout = getLayout;

  HomeownerApplyBook.pageName = pages.homeowner.apply.book.name
  HomeownerApplyBook.pageCategory = pages.homeowner.apply.book.category
