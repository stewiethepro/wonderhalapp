import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { getLayout } from "@/components/layout/AppLayout";
import { Disclosure, RadioGroup, Tab } from '@headlessui/react'
import {
  ShieldCheckIcon, 
  CheckCircleIcon, 
  HeartIcon, 
  MinusSmallIcon, 
  PlusSmallIcon 
} from '@heroicons/react/24/outline'
import { 
  CalendarDaysIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid'
import { pages } from '@/utils/segment/constants/pages';
import { trackUserIdentify } from '@/utils/segment/track';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home({data, initialSession, sessionUser}) {
  const user = useUser();
  const router = useRouter()
  const { homeId } = router.query
  const { profile, residentGroups, homeApplications, homes } = data
  const home = homes[0]
  let hasApplied = false
  
  console.log("profile: ", profile);
  console.log("residentGroups: ", residentGroups);
  console.log("home: ", home);
  console.log("homeApplications: ", homeApplications);

  const applicationsForThisHouse = homeApplications.filter(homeApplication => homeApplication.home_id === home.id)
  applicationsForThisHouse.length > 0 ? hasApplied = true : hasApplied = false

  console.log("hasApplied: ", hasApplied);

  const [loading, setLoading] = useState(false)

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

    <>

    <div className="">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto mb-12">
          <ol role="list" className="flex items-center space-x-4">
            {breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">

                    <Link href={breadcrumb.href}>
                      <a>
                        <span className="inline-flex items-center mr-4 px-2.5 py-0.5 rounded-md text-sm font-medium  text-indigo-500 bg-indigo-100 hover:bg-indigo-600 hover:text-white">
                          {breadcrumb.name}
                        </span>
                      </a>
                    </Link>
                  
                 
                  <svg
                    viewBox="0 0 6 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="h-5 w-auto text-indigo-500"
                  >
                    <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <Link href={home.href}>
                <a aria-current="page">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600"> 
                    {home.title}
                  </span>
                </a>
              </Link>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">

          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {home.homes_images.map((image) => (
                  <Tab
                    key={image.id}
                    className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">{image.alt}</span>
                        <span className="absolute inset-0 rounded-md overflow-hidden">
                          <img src={image.src} alt={image.alt} className="w-full h-full object-center object-cover" />
                        </span>
                        <span
                          className={classNames(
                            selected ? 'ring-indigo-500' : 'ring-transparent',
                            'absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
              {home.homes_images.map((image) => (
                <Tab.Panel key={image.id}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-center object-cover sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="">
              <a href="#" className="group inline-flex text-base font-medium">
                <ShieldCheckIcon
                  className="flex-shrink-0 mr-2 h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                  aria-hidden="true"
                />
                <span className="text-indigo-500"><span className="text-indigo-500 font-bold">Hamlet</span> approved</span>
              </a>
            </div>
            
            <div className="mt-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{home.street_address}</h1>
            </div>

            <div className="mt-1">
              <h2 className="sr-only">Home information</h2>
              <p className="text-lg text-gray-900">{home.title}</p>
            </div>

            <div className="mt-3">
              <h2 className="sr-only">Home information</h2>
              <p className="text-2xl text-gray-900">${home.price} / week</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <p className="text-base text-gray-700 space-y-6">{home.description}</p>
            </div>

            <div className='mt-10 flex justify-between'>
              
              <Link href={homeId + "/view/online/"}>
                <button
                  type="submit"
                  className="w-full relative flex-1 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-full"
                >
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="absolute -top-1 -right-1 inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <SparklesIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                  View online in 3D
                </button>
              </Link>

              <Link href={homeId + "/view/in-person/"}>
                <button
                  type="submit"
                  className="w-full flex-1 border border-transparent rounded-md ml-3 py-3 px-8 flex items-center justify-center text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-full"
                >
                <CalendarDaysIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                  Book a viewing
                </button>
              </Link>
                
            </div>

            {hasApplied ? 
            <>
              <div className="mt-5 flex justify-center sm:flex-col">
                <Link href={homeId + "/apply/"}>
                  <button
                    type="submit"
                    className="w-full flex-1 bg-green-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500 sm:w-full"
                  >
                    <CheckCircleIcon
                      className="flex-shrink-0 mr-2 h-6 w-6 text-white group-hover:text-green-500"
                      aria-hidden="true"
                    />
                    Application submitted
                  </button>
                </Link>
              </div>
            </>
            : 
            <>
              <div className="mt-5 flex justify-center sm:flex-col1">
                <Link href={homeId + "/apply/"}>
                  <button
                    type="submit"
                    className="w-full flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                  >
                    <CheckCircleIcon
                      className="flex-shrink-0 mr-2 h-6 w-6 text-white group-hover:text-green-500"
                      aria-hidden="true"
                    />
                    One-click apply
                  </button>
                </Link>
              </div>
            </>
            }

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="border-t divide-y divide-gray-200">
                {home.amenities.map((amenity) => (
                  <Disclosure as="div" key={amenity.name}>
                    {({ open }) => (
                      <>
                        <h3>
                          <Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
                            <span
                              className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-sm font-medium')}
                            >
                              {amenity.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusSmallIcon
                                  className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusSmallIcon
                                  className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel as="div" className="pb-6 prose prose-sm">
                          <ul role="list">
                            {amenity.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

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

  const data = { homes, homeApplications, profile, residentGroups }

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

Home.pageName = pages.homes.home.name
Home.pageCategory = pages.homes.home.category