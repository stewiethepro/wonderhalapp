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

const cards = {
  primaryCard:
    {
      name: 'Join',
      description: 'List your home with Hamlet',
      imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/house/pexels-rotekirsche-5438798.jpg',
      imageAlt: 'Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.',
      href: '/homeowner/apply',
      color: 'indigo-500',
    },
  secondaryCards: 
    [
      {
        name: 'Discover',
        description: 'Learn about what Hamlet offers homeowners',
        imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/people/pexels-caleb-oquendo-3038455.jpg',
        imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
        href: '#',
        color: 'teal-500',
      },
      {
        name: 'Connect',
        description: 'Chat to the Hamlet team',
        imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/people/pexels-andrea-piacquadio-846741.jpg',
        imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
        href: '#',
        color: 'yellow-500',
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
        <DashboardHeader headerContent={headerContent}/>
        <CardGridThree cards={cards}/>
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
        title: "Welcome Home", 
        main: "Hey " + data.profile.first_name + " 👋",
        description: "",
        button: "",
      }

      return { props: { data, navData, headerContent } };
    }
  });

HomeownerDashboard.getLayout = getLayout

HomeownerDashboard.pageName = pages.homeowner.dashboard.name
HomeownerDashboard.pageCategory = pages.homeowner.dashboard.category