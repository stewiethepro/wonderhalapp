import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { getLayout } from "@/components/layout/AppLayout";
import ResidentApplicationForm from "@/components/forms/resident/apply/ResidentApplicationForm";
import { pages } from "@/utils/segment/constants/pages";
import { trackUserIdentify } from "@/utils/segment/track";
import dynamic from 'next/dynamic';
import { useIntercom } from 'react-use-intercom';
import { updateIntercom } from '@/utils/intercom';
import Persona from '@/components/verify/Persona';
// import UploadInput from '@/components/forms/inputs/DropzoneUploadInput';
// import UploadInput from '@/components/forms/inputs/FilePondUploadInput';
// import UploadInput from '@/components/forms/inputs/UploadInput';
// import UploadInput from '@/components/forms/inputs/SupabaseUploadInput';
// import UploadCareInput from '@/components/forms/inputs/UploadCareInput';
// import UploadInput from '@/components/forms/inputs/UploadIoInput';
// import { Widget } from "@uploadcare/react-widget";
// import Passbase from '@/components/verify/Passbase';
// import { post } from '@/utils/api/request'
// import { getAccessToken } from '@/utils/sumsub';


// const Passbase = dynamic(
//     () => import('@/components/verify/Passbase'),
//     { ssr: false }
// );


export default function Verify({data, navData, headerContent, initialSession, sessionUser }) {
    const supabase = useSupabaseClient()
    const user = useUser();
    const {profile, id, residentGroupMember} = data
    const { boot, shutdown, hide, show, update } = useIntercom();

    const [loading, setLoading] = useState(false)
    console.log(id);

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

//   async function getSumsubAccessToken(userId) {
//     return new Promise(resolve => {
//       (async () => {
//         try {
//             const result = await getAccessToken(userId);
//             console.log("sumsub success: ", result); 
//             resolve(result)
//         } catch (error) {
//             console.log("sumsub error: ", error);
//             resolve(error)
//         }
//       })()
//     })
//   }

  

    return (
      <>  
        {/* <UploadInput 
            user={user}
            url={id? id.file_url : null}
            size={150}
            onUpload={(url) => {
                setFileUrl(url);
                updateResidentIdRecord({ user, id, url });
            }}
        /> */}
        {/* <UploadInput user={user}/> */}
        <Persona user={user}/>
        {/* <Passbase user={user}/> */}




        {/* <button
        onClick={() => getSumsubAccessToken(user.id)}
        >
            Click me
        </button> */}

        

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
  
  // Run queries with RLS on the server
  const { data: id, error: idError } = await supabase
  .from('resident_ids')
  .select('*')
  .single();
  
  if (idError) {
    console.log(idError);
  } else {
    console.log(id);
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

  const data = { profile, residentGroupMember, id }

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

Verify.getLayout = getLayout;

Verify.pageName = pages.resident.apply.start.name
Verify.pageCategory = pages.resident.apply.start.category