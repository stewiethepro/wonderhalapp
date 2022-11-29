import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import Script from 'next/script'
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function Matterport({home}) {

    const matterportUrl = home.matterport_url
    
    return (
        <>

        <div className="mx-auto max-w-2xl sm:px-6 lg:max-w-7xl lg:px-32">
            <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">  
                <iframe width='853' height='480' src={matterportUrl} frameborder='0' allowfullscreen allow='xr-spatial-tracking'></iframe>
            </div>
        </div>

        </>
    )
  }
  