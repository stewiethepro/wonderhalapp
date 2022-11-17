import { supabase } from "@/utils/supabase";
import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import ResidentApplicationForm from "@/components/forms/resident/apply/ResidentApplicationForm";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";

export default function ResidentApplyStart({data, navData, headerContent}) {
    const { user, error } = useUser();
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

export const getServerSideProps = withPageAuth({
    redirectTo: '/auth/sign-in',
    async getServerSideProps(ctx) {
      // Run queries with RLS on the server
      const { data: profile, error: profileError } = await supabaseServerClient(ctx)
      .from('profiles')
      .select('*')
      .single();
      
      if (profileError) {
        console.log(profileError);
      } else {
        console.log(profile);
      }

      const { data: residentGroupMember, error: residentGroupMemberError } = await supabaseServerClient(ctx)
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
            {name: "Apply", href: "/resident/apply", current: true},
            {name: "Flatmates", href: "/resident/flatmates", current: false},
            {name: "Homes", href: "/homes", current: false},
        ],
        userNavigation: [
            {name: "My account", href: "/account", onClick: "#"},
            {name: "Settings", href: "/settings", onClick: "#"},
        ],
    }

      return { props: { data , navData } };
    }
  });

ResidentApplyStart.getLayout = getLayout;

ResidentApplyStart.pageName = pages.resident.apply.start.name
ResidentApplyStart.pageCategory = pages.resident.apply.start.category