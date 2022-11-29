import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { getLayout } from "@/components/layout/AppLayout";
import OnboardingForm from "@/components/forms/onboarding/OnboardingForm";
import { pages } from "@/utils/segment/constants/pages";

export default function Onboarding ({data, navData, initialSession, sessionUser}) {
  const user = useUser();
  const profile = data.profile

  return (
    <>
        <OnboardingForm user={ user }/>
    </>
  )
};

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

  return { props: { data, navData, initialSession, sessionUser } };
}

Onboarding.getLayout = getLayout;

Onboarding.pageName = pages.onboarding.start.name
Onboarding.pageCategory = pages.onboarding.start.category
