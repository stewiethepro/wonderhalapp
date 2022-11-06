import { supabaseClient, supabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { getLayout } from "@/components/layout/AppLayout";
import { withPageAuth, getUser } from '@supabase/auth-helpers-nextjs';
import OnboardingForm from "@/components/forms/onboarding/OnboardingForm";
import { pages } from "@/utils/segment/constants/pages";

export default function Onboarding ({data, user, navData}) {
  
const profile = data.profile

  return (
    <>
        <OnboardingForm user={ user }/>
    </>
  )
};

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
          {name: "Profile", href: "/profile", onClick: "#"},
          {name: "Settings", href: "/settings", onClick: "#"},
      ],
  }

    return { props: { data, navData } };
  }
});

Onboarding.getLayout = getLayout;

Onboarding.pageName = pages.onboarding.start.name
Onboarding.pageCategory = pages.onboarding.start.category
