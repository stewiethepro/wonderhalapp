import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { getLayout } from "@/components/layout/AppLayout";
import { Disclosure, RadioGroup, Tab } from '@headlessui/react'
import {ShieldCheckIcon, HeartIcon, MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { pages } from '@/utils/segment/constants/pages';
import { trackUserIdentify } from '@/utils/segment/track';
import HomeApplicationForm from '@/components/forms/homes/apply/HomeApplicationForm';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home({data, initialSession, sessionUser}) {
  const user = useUser();
  const router = useRouter()
  const { homeId } = router.query
  const { homes, homeApplications, profile, residentGroups, flatmates } = data
  const home = homes[0]
  let hasApplied = false

  const applicationsForThisHouse = homeApplications.filter(homeApplication => homeApplication.home_id === home.id)
  applicationsForThisHouse.length > 0 ? hasApplied = true : hasApplied = false

  console.log("hasApplied: ", hasApplied);

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
  
  const breadcrumbs = [
    { id: 1, name: 'Homes', href: '/homes' },
  ]

  return (

    <HomeApplicationForm home={home} homeApplications={homeApplications} user={user} profileData={profile} residentGroups={residentGroups} flatmates={flatmates} hasApplied={hasApplied}/>

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

  // Run queries with RLS on the server
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

  const { data: flatmates, error: flatmatesError } = await supabase
  .from('resident_group_members')
  .select('*')

  if (flatmatesError) {
    console.log(flatmatesError);
  } else {
    console.log(flatmates);
  }

  const data = { homes, homeApplications, profile, residentGroups, flatmates }

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

  const headerContent = {
    title: "Resident Application", 
    main: "We just need a few details",
    description: "This shouldn't take more than 5-10 mins, we've broken it up into nice little steps.",
  }

  console.log(navData);
  
  return { props: { data, navData, headerContent, initialSession, sessionUser } };
}

Home.getLayout = getLayout

Home.pageName = pages.homes.home.apply.name
Home.pageCategory = pages.homes.home.apply.category