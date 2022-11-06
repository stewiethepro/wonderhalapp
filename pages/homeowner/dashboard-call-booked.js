import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/utils/supabase';
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import DashboardHeader from '@/components/header/DashboardHeader';
import CardGridThree from "@/components/cards/CardGridThree";
import { pages } from '@/utils/segment/constants/pages';
import { trackUserIdentify } from '@/utils/segment/track';
import DashboardLayout from '@/components/layout/DashboardLayout';

const cards = {
  actionCards: [
    {
      name: 'Your homes',
      description: 'View your homes',
      imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/house/pexels-maksim-goncharenok-4352247.jpg',
      imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
      href: '#',
      color: 'to-indigo-500',
      opacity: 'opacity-50',
    },
    {
      name: 'Some stuff',
      description: 'Look at this stuff',
      imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/house/pexels-rotekirsche-5438823.jpg',
      imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
      href: '#',
      color: 'to-teal-500',
      opacity: 'opacity-50',
    },
  ]
}

export default function HomeownerDashboard({data, headerContent}) {
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
        <DashboardLayout headerContent={headerContent} cards={cards}/>
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
            {name: "Dashboard", href: "/homeowner/dashboard", current: true},
            {name: "Apply", href: "/homeowner/apply", current: false},
            {name: "Discover", href: "/discover", current: false},
            {name: "Chat", href: "/chat", current: false},
        ],
        userNavigation: [
            {name: "Profile", href: "/profile", onClick: "#"},
            {name: "Settings", href: "/settings", onClick: "#"},
        ],
      }

      const headerContent = {
        title: "Dashboard", 
        main: "Hey " + data.profile.first_name + " 👋",
        description: "",
        button: {
          text: "Go figure",
          href: "#"
        },
      }

      return { props: { data, navData, headerContent } };
    }
  });

HomeownerDashboard.getLayout = getLayout

HomeownerDashboard.pageName = pages.homeowner.dashboard.name
HomeownerDashboard.pageCategory = pages.homeowner.dashboard.category