import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
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
import DashboardLayout3 from '@/components/layout/DashboardLayout3';
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';

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
      name: 'Your bills',
      description: 'Review your maintenance invoices',
      imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/house/pexels-rotekirsche-5438823.jpg',
      imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
      href: '#',
      color: 'to-teal-500',
      opacity: 'opacity-50',
    },
    {
      name: 'Your contracts',
      description: 'Flick through your legal documents',
      imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/house/pexels-artem-saranin-1547813.jpg',
      imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
      href: '#',
      color: 'to-pink-500',
      opacity: 'opacity-50',
    },
  ]
}

export default function HomeownerDashboard({data, headerContent}) {
  const user = useUser();
  const profile = data.profile
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
        <DashboardLayout3 headerContent={headerContent} cards={cards}/>
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
        {name: "Dashboard", href: "/homeowner/dashboard", current: true},
        {name: "Apply", href: "/homeowner/apply", current: false},
        {name: "Discover", href: "/discover", current: false},
        {name: "Chat", href: "/chat", current: false},
    ],
    userNavigation: [
        {name: "My account", href: "/account", onClick: "#"},
        {name: "Settings", href: "/settings", onClick: "#"},
    ],
  }

  const headerContent = {
    title: "Welcome Home", 
    main: "Hey " + data.profile.first_name + " 👋",
    description: "",
    button: "",
  }

  return { props: { data, navData, headerContent, initialSession, sessionUser } };
}

HomeownerDashboard.getLayout = getLayout

HomeownerDashboard.pageName = pages.homeowner.dashboard.name
HomeownerDashboard.pageCategory = pages.homeowner.dashboard.category