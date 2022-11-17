import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import { 
  MinusCircleIcon as MinusCircleIconSolid,
  ChevronDownIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid'
import Warning from '@/components/forms/utility/Warning'
import { 
    trackHomeApplicationDeleted, 
    trackHomeApplicationDeletedResidentNotified 
} from '@/utils/segment/track'
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function ApplicationDetails({home, profile, application, residentGroups, flatmates}) {
    const router = useRouter()
    const [openWarning, setOpenWarning] = useState(false)
    const [loading, setLoading] = useState(false)
    const [warningProps, setWarningProps] = useState(
        {
        title: "",
        message: "",
        actionButton: {
            title: "",
            onClick: "",
        }
        }
    )

    function openDeleteHomeApplicationWarning(home, profile, application, flatmates){
        setWarningProps(
          {
            title: "Delete application " + application.id + "?",
            message: "Are you sure you want to delete application " + application.id + "?",
            actionButton: {
              title: "Delete application",
              onClick: () => deleteSelectedHomeApplication(home, profile, application, flatmates)
            }
          }
        )
        setOpenWarning(true)
    }

    async function deleteHomeApplication(request) {
        return new Promise(resolve => {
          (async () => {
            try {
                // delete the resident group members
                const { data, error } = await supabase
                .from('home_applications')
                .delete()
                .eq('id', request)
    
                if (error) {
                    console.log("Supabase error:", error)
                    resolve(error)
                } else {
                    console.log("home_application: ", data);
                    resolve(data)
                }
    
            } catch (error) {
                console.log("API error: ", error);
                resolve(error)
            }
          })()
        })
    }

    async function sendDeleteHomeApplicationNotifications(home, profile, application, flatmates) {
        return new Promise(resolve => {
          (async () => {
            try {
                
                const eventTitle = "Home Application Deleted"
                const eventUserId = profile.id
                const eventProperties = {
                    applicant: {
                        first_name: profile.first_name,
                        email: profile.email,
                        userId: profile.id,
                        resident_group_id: application.resident_group_id,
                    },
                    application: {
                        reference: application.id,
                        start_date: application.startDate,
                        deleted_by: profile.first_name,
                    },
                    home: {
                        available_from: home.available_from,
                        description: home.description,
                        image: home.homes_images[0].src,
                        href: home.href,
                        id: home.id,
                        price: home.price,
                        property_type: home.property_type, 
                        street_address: home.street_address,
                        summary: home.summary,
                        title: home.title,
                        trademe_url: home.trademe_url,
                    }
                }

                // Track Segment Event - Add Flatmates Form Submitted 
                trackHomeApplicationDeleted(eventTitle, eventUserId, eventProperties)
      
                if (application.resident_group_id) {

                    flatmates.map((flatmate) => {

                        const eventTitle = "Home Application Deleted Resident Notified"
                        const eventUserId = flatmate.user_id
                        const eventProperties = {
                            applicant: {
                                first_name: flatmate.first_name,
                                email: flatmate.email,
                                userId: flatmate.user_id,
                                resident_group_id: application.resident_group_id,
                            },
                            application: {
                                reference: application.id,
                                start_date: application.startDate,
                                deleted_by: profile.first_name,
                            },
                            home: {
                                available_from: home.available_from,
                                description: home.description,
                                image: home.homes_images[0].src,
                                href: home.href,
                                id: home.id,
                                price: home.price,
                                property_type: home.property_type, 
                                street_address: home.street_address,
                                summary: home.summary,
                                title: home.title,
                                trademe_url: home.trademe_url,
                            }
                        }
                    
                        trackHomeApplicationDeletedResidentNotified(eventTitle, eventUserId, eventProperties)

                    })
      
                } else {

                        const eventTitle = "Home Application Deleted Resident Notified"
                        const eventUserId = profile.id
                        const eventProperties = {
                            applicant: {
                                first_name: profile.first_name,
                                email: profile.email,
                                userId: profile.id,
                            },
                            application: {
                                reference: application.id,
                                start_date: application.startDate,
                                deleted_by: profile.first_name,
                            },
                            home: {
                                available_from: home.available_from,
                                description: home.description,
                                image: home.homes_images[0].src,
                                href: home.href,
                                id: home.id,
                                price: home.price,
                                property_type: home.property_type, 
                                street_address: home.street_address,
                                summary: home.summary,
                                title: home.title,
                                trademe_url: home.trademe_url,
                            }
                        }
                    
                        trackHomeApplicationDeletedResidentNotified(eventTitle, eventUserId, eventProperties)
                  
                }
      
                resolve("segment track events triggered, notifications sent")
      
            } catch (error) {
                console.log("API error: ", error);
                resolve(error)
            }
          })()
        })
    }

    async function supabaseDeleteHomeApplication(home, profile, application, flatmates) {

        return new Promise(resolve => {
    
            (async () => {
              try {
                  const result1 = await deleteHomeApplication(application.id);
                  console.log("result1: ", result1);
              } catch (error) {
                  console.log("error: ", error);
                  resolve(error)
              }

              try {
                  const result2 = await sendDeleteHomeApplicationNotifications(home, profile, application, flatmates);
                  console.log("result2: ", result2);
              } catch (error) {
                  console.log("error: ", error);
                  resolve(error)
              }
    
              resolve("success")
    
            })();
    
        })
    }

    async function deleteSelectedHomeApplication(home, profile, application, flatmates) {
        setLoading(true)
        const result = await supabaseDeleteHomeApplication(home, profile, application, flatmates)
        if (result === "success") {
            console.log("nice, the function worked all the way through");
        } else {
            console.log("too bad, the function failed along the way");
        }
        setLoading(false)
        setOpenWarning(false)
        setTimeout(() => router.push('/homes'), 1000)
    }

    console.log("home: ", home);
    console.log("profile: ", profile);
    console.log("application: ", application);
    console.log("residentGroups: ", residentGroups);
    console.log("flatmates: ", flatmates);

    const applicationCreatedDate = new Date(application.created_at).toLocaleDateString('en-gb');
    
    return (
        <>
        <div className="bg-gray-50">
            <div className="mx-auto max-w-2xl pt-16 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="px-0 flex items-baseline justify-between space-y-0">
                <div className="flex sm:items-baseline sm:space-x-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Application #{application.id}</h1>
                </div>
                

                <div className="mt-4 flex-shrink-0">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                        Application options
                        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                    </div>

                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                            <a
                                href="#"
                                onClick={() => openDeleteHomeApplicationWarning(home, profile, application, flatmates)}
                                className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm'
                                )}
                            >
                                <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                Delete application
                            </a>
                            )}
                        </Menu.Item>
                        </div>
                    </Menu.Items>
                    </Transition>
                </Menu>
                </div>

            </div>
    
            <div className="mt-6">
                <h2 className="sr-only">Application</h2>
    
                <div className="space-y-8">
                    <div
                    key={home.id}
                    className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                    >
                    <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                        <div className="sm:flex lg:col-span-7">
                        <div className="aspect-w-1 aspect-h-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                            <img
                            src={home.homes_images[0].src}
                            alt={home.homes_images[0].alt}
                            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                            />
                        </div>
    
                        <div className="mt-6 sm:mt-0 sm:ml-6">
                            <h3 className="text-base font-medium text-gray-900">
                            <a href={home.href}>{home.street_address}</a>
                            </h3>
                            <p className="mt-2 text-sm font-medium text-gray-900">${home.price.toLocaleString()} / week</p>
                            <p className="mt-3 text-sm text-gray-500">{home.summary}</p>
                        </div>
                        </div>
    
                        <div className="mt-6 lg:col-span-5 lg:mt-0">
                        <dl className="grid grid-cols-2 gap-x-6 text-sm">
                            <div>
                            <dt className="font-medium text-gray-900">Hamlet Residents</dt>
                            <dd className="mt-3 text-gray-500">
                                {application.resident_group_id ? 

                                flatmates.map((flatmate) => (
                                    <span className="block">{flatmate.first_name}</span>
                                ))

                                :
                                
                                <span className="block">{profile.first_name}</span>

                                }
                            </dd>
                            </div>
                            <div>
                            <dt className="font-medium text-gray-900">Application Submitted</dt>
                            <dd className="mt-3 space-y-3 text-gray-500">
                                <p>{applicationCreatedDate}</p>
                            </dd>
                            </div>
                        </dl>
                        </div>
                    </div>
    
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6 lg:p-8">
                        <h4 className="sr-only">Status</h4>
                        <p className="text-sm font-medium text-gray-900">
                            {
                                application.stage === 1 ? "We're reviewing your application. If selected we'll email you with an update and ask for some more information."
                                :
                                application.stage === 2 ? "Your application has been advanced. Check your email for a link asking for some additional documentation."
                                : 
                                application.stage === 3 ? "Your application has been accepted! Check your email for a link to the tenancy agreement." 
                                : 
                                "Congrats, the home is yours! Let's get you moved in!" 
                            }
                        </p>
                        <div className="mt-6 " aria-hidden="true">
                        <div className="overflow-hidden rounded-full bg-gray-200">
                            <div
                            className="h-2 rounded-full bg-indigo-600"
                            style={
                                application.stage === 1 ? { width: `7.5%` } 
                                :
                                application.stage === 2 ? { width: `37.5%` } 
                                : 
                                application.stage === 3 ? { width: `63.5%` } 
                                : 
                                { width: `100%` }
                            }
                            />
                        </div>
                        <div className="mt-6 grid-cols-1 sm:grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                            <div className="text-indigo-600">
                            1. Application submitted
                            </div>
                            <div className={classNames(application.stage > 1 ? 'text-indigo-600' : '', 'sm:text-center')}>
                            2. Resident checks
                            </div>
                            <div className={classNames(application.stage > 2 ? 'text-indigo-600' : '', 'sm:text-center')}>
                            3. Application accepted
                            </div>
                            <div className={classNames(application.stage > 3 ? 'text-indigo-600' : '', 'sm:text-right')}>
                            4. Agreement signed
                            </div>
                        </div>

                        </div>
                    </div>
                    </div>
                </div>
            </div>
    
            </div>
        </div>

        <Warning open={openWarning} onClose={() => setOpenWarning(false)} loading={loading} warningProps={warningProps} />
        
        </>
    )
  }
  