/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XCircleIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useUser } from '@supabase/auth-helpers-react';
import Courier from "@/components/notifications/Courier";

const dummyUser = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }

const defaultNavigation = [
    {name: "A thing", href: "#", current: true},
    {name: "Other thing", href: "#", current: false},
    {name: "Another thing", href: "#", current: false},
]

const defaultUserNavigation = [
    {name: "Da Profile", href: "#", onClick: "#"},
    {name: "Settings", href: "#", onClick: "#"},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AppNav({data, navData}) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient()
  const [navigation, setNavigation] = useState(defaultNavigation)
  const [userNavigation, setUserNavigation] = useState(defaultUserNavigation)
  const profile = data.profile
  console.log(profile);

  useEffect(() => {
    if (navData) {
      console.log("found the navdata on the server");
        setNavigation(navData.navigation)
        setUserNavigation(navData.userNavigation)
    }
  }, [])

  return (
    <Disclosure as="nav" className=" border-gray-200">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                      />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link 
                          href={item.href}
                          key={item.name}
                        >
                          <a
                            className={classNames(
                              router.asPath.startsWith(item.href)
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-600',
                              'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                            )}
                            aria-current={router.asPath === item.url ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                 
                  <div className='flex sm:ml-6'>
                    <div className='flex items-center mr-3'>
                      {/*Courier Notifications Inbox*/}
                      <Courier className="z-10"/>
                    </div>
                    <div className="hidden sm:flex sm:items-center">

                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative z-10">
                        <div>
                          <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={dummyUser.imageUrl} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item key="activeUser">
                              <div className="px-4 py-3">
                                <p className="text-sm">Signed in as</p>
                                <p className="truncate text-sm font-medium text-gray-900">{profile.email}</p>
                              </div>
                            </Menu.Item>
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-indigo-500 text-white' : 'text-gray-700',
                                      'block px-4 py-2 text-sm rounded'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          <Menu.Item key="signOut">
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      onClick={async () => {
                                        await supabaseClient.auth.signOut();
                                        router.push('/auth/sign-in');
                                      }}
                                      className={classNames(
                                        active ? 'bg-indigo-500 text-white' : 'text-gray-700',
                                        'block px-4 py-2 text-sm rounded-md'
                                      )}
                                    >
                                      Sign out
                                    </a>
                                  )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                      {/* Courier Notifications Inbox*/}
                      {/* <Courier /> */}
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-slate-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XCircleIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                        'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={dummyUser.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{profile.first_name + " " + profile.last_name}</div>
                      <div className="text-sm font-medium text-gray-500">{profile.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                    <Disclosure.Button
                        key="signOut"
                        as="a"
                        href="/api/auth/logout"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Sign out
                      </Disclosure.Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
  )
}
