import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Ripples } from '@uiball/loaders'
import { getLayout } from "@/components/layout/SiteLayout"
import { pages } from '@/utils/segment/constants/pages';

const Welcome = () => {
  const { isLoading, session, error, supabaseClient } = useSessionContext();
  const user = useUser();
  console.log("user: ", user);
  const [data, setData] = useState();
  const [count, setCount] = useState(0);
  const router = useRouter()
  
  useEffect(() => {
    async function enterApp() {
      console.log("enter app has run");
        let { data, error } = await supabaseClient
        .from('profiles')
        .select('is_onboarding, user_type')
        .single()
        
        setData(data);
    
        console.log(data);
    
        const {is_onboarding, user_type} = data
    
        if (!is_onboarding) {
          router.push("/" + user_type.toLowerCase() + '/dashboard')
        } else {
          const {query} = router
          const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&');
          console.log(queryString)
          let redirectLink = "/onboarding/start"
          {queryString? redirectLink = redirectLink + "?" + queryString : null }
          router.push(redirectLink)
        }
    }
    // Only run query once user is logged in.
    if (user) {
      enterApp()
    } else {
      setCount(count + 1)
    }
  }, [ user ]);

  if (!user) return (
    <>
      <div className="flex h-screen">
        <div className='m-auto'>
          <p className="my-4 text-2xl font-extrabold text-indigo-600 sm:tracking-tight sm:text-4xl">
            Fetching user data...
          </p>
          <div className='flex justify-center'>
            <Ripples
                size={100}
                speed={2} 
                color="#6366f1" 
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
    <div className="flex h-screen">
      <div className='m-auto'>
        <p className="my-4 text-2xl font-extrabold text-indigo-600 sm:tracking-tight sm:text-4xl">
          Just tidying up...
        </p>
        <div className='flex justify-center'>
          <Ripples
              size={100}
              speed={2} 
              color="#6366f1" 
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default Welcome;

Welcome.pageName = pages.welcome.name
Welcome.pageCategory = pages.welcome.category
