import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import DashboardHeader from "@/components/header/DashboardHeader";
import Calendly from "@/components/booking/Calendly";
import CalScheduler from "@/components/booking/Cal";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import Script from 'next/script';
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';

export default function ResidentApplyBook({data, navData, headerContent, initialSession, sessionUser}) {
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


  function createIframe() {
    if (document.getElementById("movinghubHandDiv").innerHTML === "") {
        var i = document.createElement("h2");
        var itext = document.createTextNode("Unfortunately our system is currently down for Maintenance, should you wish to contact us please call 0800 141 470 Monday to Thursday 8:30am to 6:30pm, Friday 8:30am to 5:30pm (Local Time).");
        i.setAttribute("style", "margin:50px 10px;text-align:center");
        i.appendChild(itext);
        document.getElementById("movinghubMainDiv").appendChild(i);
    } else {
        var i = document.createElement("iframe");
        i.setAttribute("src", "https://nz-apps.utilihub.io/widgets/affiliate-quick/refer/customer/bed9dd589338d8a66b6974eb891433060b1557b779ae4c745cb829658f78764f969467d0553985b535c2ec4ffb9bf34530fc4beca04adf72fff377ceb59a01cdwx0Y6eRGWc-K0m2GAVaKlANUisAxj1oqANHeXysi--g~");
                    i.setAttribute("scrolling", "no");
                    i.setAttribute("frameborder", "0");
                    i.setAttribute("width", "100%");
                    i.setAttribute("style", "border:none;");
                    document.getElementById("movinghubMainDiv").appendChild(i);
                    iFrameResize({log: false, autoResize: true, checkOrigin: false, heightCalculationMethod: "taggedElement", warningTimeout: 10000});
                }
            }

    return (
      <>  
        <DashboardHeader data={profile} headerContent={headerContent}/>

        {/* <div id="movinghubMainDiv"></div>
        <div id="movinghubHandDiv"></div>

        <Script type="text/javascript" src="https://nz-apps.utilihub.io/assets/js/widgets/movinghub.handshake.js"/>
        <Script type="text/javascript" src="https://nz-apps.utilihub.io/assets/js/widgets/iframe-resizer/iframeResizer.min.js"/> */}
        
        <div id="movinghubMainDiv"></div>
        <div id="movinghubHandDiv"></div>
        
        <Script 
            type="text/javascript"
            src="https://nz-apps.utilihub.io/assets/js/widgets/movinghub.handshake.js"
            onLoad={() => {
                if (window.addEventListener) {
                    window.addEventListener("load", createIframe, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onload", createIframe);
                } else {
                    window.onload = createIframe;
                }
            }}
        />
        <Script 
            type="text/javascript"
            src="https://nz-apps.utilihub.io/assets/js/widgets/iframe-resizer/iframeResizer.min.js"
        />

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

  const headerContent = {
    title: "Hamlet move", 
    main: "Organsise your move",
    description: "We partner with MovingHub to get you into your new Hamlet home.",
  }

  return { props: { data, navData, headerContent, initialSession, sessionUser } };

}


  ResidentApplyBook.getLayout = getLayout;

  ResidentApplyBook.pageName = pages.resident.apply.book.name
  ResidentApplyBook.pageCategory = pages.resident.apply.book.category
