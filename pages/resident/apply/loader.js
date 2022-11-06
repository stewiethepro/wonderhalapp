import { supabase, createResidentGroup } from "@/utils/supabase";
import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import CardGridOne from "@/components/cards/CardGridOne";
import DashboardHeader from "@/components/header/DashboardHeader";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import { get, post } from "@/utils/api/request";
import TransitionLoader from "@/components/loaders/TransitionLoader";

export default function ResidentApply({data, navData, headerContent}) {

    return (
      <>
        <TransitionLoader/>
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
            {name: "Profile", href: "/profile", onClick: "#"},
            {name: "Settings", href: "/settings", onClick: "#"},
        ],
    }

    console.log(profile.status);

    const headerContent = profile.status === 'prospect' ?  
      {
        title: "Resident Application", 
        main: "We just need a few details",
        description: "This shouldn't take more than 5-10 mins, we've broken it up into nice little steps.",
      }
      :
      {
        title: "Resident Application", 
        main: "Thank you for your application 🤝",
        description: "You can check on the status of your application in your dashboard.",
      }
    
      return { props: { data, navData, headerContent } };
    }
  });

ResidentApply.getLayout = getLayout;

ResidentApply.pageName = pages.resident.apply.index.name
ResidentApply.pageCategory = pages.resident.apply.index.category