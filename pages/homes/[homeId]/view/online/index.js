import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { getLayout } from "@/components/layout/AppLayout";
import { Disclosure, RadioGroup, Tab } from '@headlessui/react'
import {ShieldCheckIcon, CheckCircleIcon, HeartIcon, MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { pages } from '@/utils/segment/constants/pages';
import { trackUserIdentify } from '@/utils/segment/track';
import Matterport from '@/components/viewings/matterport';
import DashboardHeader from '@/components/header/DashboardHeader';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ViewHomeOnline({data, headerContent, initialSession, sessionUser}) {
  const user = useUser();
  const { profile, homes } = data
  const home = homes[0]

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

    {/* <DashboardHeader user={user} data={profile} headerContent={headerContent}/> */}

    <Matterport home={home}/>

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
  
  const homeId = ctx.query.homeId

  // Run queries with RLS on the server
  const { data: homes, error: homesError } = await supabase
  .from('homes_listed')
  .select('*, homes_images(*)')
  .eq('id', homeId)

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

  const { data: residentGroups, error: residentGroupsError } = await supabase
  .from('resident_groups')
  .select('*')

  if (residentGroupsError) {
    console.log(residentGroupsError);
  } else {
    console.log(residentGroups);
  }

  const data = { homes, homeApplications, profile, residentGroups }

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

  const streetAddress = homes[0].street_address

  const headerContent = {
    title: "Hamlet virtual viewing", 
    main: streetAddress,
  }

  console.log(navData);

  return { props: { data, navData, headerContent, initialSession, sessionUser } };
}

ViewHomeOnline.getLayout = getLayout

ViewHomeOnline.pageName = pages.homes.home.view.online.name
ViewHomeOnline.pageCategory = pages.homes.home.view.online.category