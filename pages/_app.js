import '@/styles/globals.css'
import { useState, useEffect } from 'react';
import { Router, useRouter } from 'next/router';
import { supabase } from '@/utils/supabase';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useUser } from '@supabase/auth-helpers-react';
import Script from 'next/script'
import * as snippet from '@segment/snippet'
import { trackPage } from '@/utils/segment/track';
import TransitionLoader from '@/components/loaders/TransitionLoader';
import { IntercomProvider, useIntercom } from 'react-use-intercom';

const INTERCOM_APP_ID = 'ykoek7lm';

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const [isLoading, setIsLoading] = useState(false);
  const [authenticatedState, setAuthenticatedState] = useState('not-authenticated')
  const router = useRouter()
  const segmentWriteKey = process.env.NEXT_PUBLIC_SEGMENT_CLIENT_WRITE_KEY  

  // ----- Auth start ----- //

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // handleAuthChange(event, session)
      if (event === 'SIGNED_IN') {
        setAuthenticatedState('authenticated')
      }
      if (event === 'SIGNED_OUT') {
        setAuthenticatedState('not-authenticated')
      }
    })
    checkUser()
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // async function handleAuthChange(event, session) {
  //   await fetch('/api/auth/set-cookie', {
  //     method: 'POST',
  //     headers: new Headers({ 'Content-Type': 'application/json' }),
  //     credentials: 'same-origin',
  //     body: JSON.stringify({ event, session }),
  //   })
  // }

  async function checkUser() {

    const user = await supabase.auth.getUser()
    if (user) {
      setAuthenticatedState('authenticated')
    }
  }

  // ----- Auth end ----- //

  // ----- Segment start ----- //

  const loadSegment = () => {
    const options = {
      apiKey: segmentWriteKey,
      page: false,
    }
    if (process.env.NEXT_PUBLIC_NODE_ENV) {
      return snippet.max(options)
    } else {
      return snippet.min(options)
    }
 }

 useEffect(() => {
  const handleRouteChangeComplete = (url) => {
    trackPage(Component.pageCategory , Component.pageName , {url: url})
  }
  router.events.on('routeChangeComplete', handleRouteChangeComplete)

  return () => {
    router.events.off('routeChangeComplete', handleRouteChangeComplete)
  }
}, [Component.pageName])

// ----- Segment end ----- //

// ----- Layout start ----- //

const getLayout = Component.getLayout || ((page) => page)

// ----- Layout end ----- //

// ----- Loader start ----- //

const style = {
  height: 600,
};

useEffect(() => {
  Router.events.on("routeChangeStart", (url)=>{
    setIsLoading(true)
  });

  Router.events.on("routeChangeComplete", (url)=>{
    setIsLoading(false)
  });

  Router.events.on("routeChangeError", (url) =>{
    setIsLoading(false)
  });

}, [Router])

// ----- Loader end ----- //

// ----- Render start ----- //

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <IntercomProvider 
        appId={INTERCOM_APP_ID} 
        autoBoot
      >
        <Script dangerouslySetInnerHTML={{ __html: loadSegment() }} id="segment-script" />
        {isLoading ? 
        <>
        <TransitionLoader />
        </>
        :
        <>
        {getLayout(
          <Component {...pageProps} />, pageProps
        )}
        </>
        }
      </IntercomProvider>
    </SessionContextProvider>
  );
}

// ----- Render end ----- //



export default MyApp
