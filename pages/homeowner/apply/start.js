import { supabase } from "@/utils/supabase";
import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import HomeownerApplicationForm from "@/components/forms/homeowner/apply/HomeownerApplicationForm";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";

export default function HomeownerApplyStart({data, navData, headerContent}) {
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
        <HomeownerApplicationForm user={user} profileData={profile}/>
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

      return { props: { data, navData, headerContent } };
    }
  });

  HomeownerApplyStart.getLayout = getLayout;

  HomeownerApplyStart.pageName = pages.homeowner.apply.start.name
  HomeownerApplyStart.pageCategory = pages.homeowner.apply.start.category