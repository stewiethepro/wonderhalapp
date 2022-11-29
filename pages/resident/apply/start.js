import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import ResidentApplicationForm from "@/components/forms/resident/apply/ResidentApplicationForm";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";

export default function ResidentApplyStart({data, navData, headerContent, initialSession, sessionUser }) {
    const user = useUser();
    const {profile, residentGroupMember} = data

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
        <ResidentApplicationForm user={user} profileData={profile} residentGroupMemberData={residentGroupMember}/>
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
  
  if (profileError) {
    console.log(profileError);
  } else {
    console.log(profile);
  }

  const { data: residentGroupMember, error: residentGroupMemberError } = await supabase
  .from('resident_group_members')
  .select()
  .eq('user_id', profile.id)
  .single();
  
  if (residentGroupMemberError) {
    console.log(residentGroupMemberError);
  } else {
    console.log(residentGroupMember);
  }

  const data = { profile, residentGroupMember }

  const navData = {
    navigation: [
        {name: "Dashboard", href: "/resident/dashboard", current: false},
        {name: "Resident application", href: "/resident/apply", current: true},
        {name: "Flatmates", href: "/resident/flatmates", current: false},
        {name: "Homes", href: "/homes", current: false},
    ],
    userNavigation: [
        {name: "My account", href: "/account", onClick: "#"},
        {name: "Settings", href: "/settings", onClick: "#"},
    ],
  }

  return { props: { data , navData, initialSession, sessionUser } };
}

ResidentApplyStart.getLayout = getLayout;

ResidentApplyStart.pageName = pages.resident.apply.start.name
ResidentApplyStart.pageCategory = pages.resident.apply.start.category