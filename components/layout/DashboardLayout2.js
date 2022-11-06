import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import {
  AcademicCapIcon,
  BadgeCheckIcon,
  BellIcon,
  CashIcon,
  ClockIcon,
  MenuIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/24/outline'
import DashboardHeader from '@/components/header/DashboardHeader'
import DashboardHeaderMain from '@/components/header/DashboardHeaderMain'
import Card from '@/components/cards/Card'

const dummyUser = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }

const stats = [
  { label: 'Vacation days left', value: 12 },
  { label: 'Sick days left', value: 4 },
  { label: 'Personal days left', value: 2 },
]
const actions = [
  {
    icon: ClockIcon,
    name: 'Request time off',
    href: '#',
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-50',
  },
  {
    icon: BadgeCheckIcon,
    name: 'Benefits',
    href: '#',
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  },
  {
    icon: UsersIcon,
    name: 'Schedule a one-on-one',
    href: '#',
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
  },
  { icon: CashIcon, name: 'Payroll', href: '#', iconForeground: 'text-yellow-700', iconBackground: 'bg-yellow-50' },
  {
    icon: ReceiptRefundIcon,
    name: 'Submit an expense',
    href: '#',
    iconForeground: 'text-rose-700',
    iconBackground: 'bg-rose-50',
  },
  {
    icon: AcademicCapIcon,
    name: 'Training',
    href: '#',
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
  },
]
const recentHires = [
  {
    name: 'Leonard Krasner',
    handle: 'leonardkrasner',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Floyd Miles',
    handle: 'floydmiles',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Emily Selman',
    handle: 'emilyselman',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Kristin Watson',
    handle: 'kristinwatson',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
]
const announcements = [
  {
    id: 1,
    title: 'Office closed on July 2nd',
    href: '#',
    preview:
      'Cum qui rem deleniti. Suscipit in dolor veritatis sequi aut. Vero ut earum quis deleniti. Ut a sunt eum cum ut repudiandae possimus. Nihil ex tempora neque cum consectetur dolores.',
  },
  {
    id: 2,
    title: 'New password policy',
    href: '#',
    preview:
      'Alias inventore ut autem optio voluptas et repellendus. Facere totam quaerat quam quo laudantium cumque eaque excepturi vel. Accusamus maxime ipsam reprehenderit rerum id repellendus rerum. Culpa cum vel natus. Est sit autem mollitia.',
  },
  {
    id: 3,
    title: 'Office closed on July 2nd',
    href: '#',
    preview:
      'Tenetur libero voluptatem rerum occaecati qui est molestiae exercitationem. Voluptate quisquam iure assumenda consequatur ex et recusandae. Alias consectetur voluptatibus. Accusamus a ab dicta et. Consequatur quis dignissimos voluptatem nisi.',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout(props) {
    const { actionCards } = props.cards
    const { headerContent } = props
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <main className="pb-8">
          <div className="grid grid-rows-1 grid-flow-col gap-y-2 gap-4">

            {/* Row 1 Start */}
              <div className="row-span-1 col-span-3">
                <DashboardHeader
                headerContent={headerContent} 
                />
              </div>
            {/* Row 1 End */}

          </div>

          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
            <div className="sm:row-span-2">
            <Card 
              card={actionCards[0]}
              style={{
                "aspectRatio": "sm:aspect-h-5 sm:aspect-w-4"
              }}
            />
            </div>

            <div className="">
            <Card 
              card={actionCards[1]}
              style={{
                "aspectRatio": "sm:aspect-h-5 sm:aspect-w-4"
              }}
            />
            </div>
            <div className="sm:relative sm:aspect-none sm:h-full">
            <Card 
              card={actionCards[2]}
              style={{
                "aspectRatio": "sm:aspect-h-5 sm:aspect-w-4"
              }}
            />
            </div>
          </div>

            {/* Row 2 Start */}
              {/* <div className="grid grid-cols-3 grid-rows-2 col-span-3 row-span-1 gap-12">
                <div className="col-span-1 row-span-1">
                  <Card 
                        card={actionCards[0]}
                        style={{
                          "aspectRatio": "sm:aspect-h-5 sm:aspect-w-4"
                        }}
                  />
                </div>
                <div className="col-span-2 row-span-2">
                  <Card 
                        card={actionCards[1]}
                        style={{
                          "aspectRatio": "sm:aspect-h-1 sm:aspect-w-4"
                        }}
                  />
                  <Card
                        card={actionCards[2]}
                        style={{
                          "aspectRatio": "sm:aspect-h-1 sm:aspect-w-4"
                        }}
                  />
                </div>
              </div> */}
            {/* Row 2 End */}

          {/* Row 3 Start */}
          {/* <div className="h-screen grid grid-cols-2 col-span-3 row-span-1 gap-12">
                <div className="col-span-1">
                  <Card 
                        card={actionCards[0]}
                        style={{
                          "aspectRatio": "sm:aspect-h-1 sm:aspect-w-1"
                        }}
                  />
                </div>
                <div className="col-span-1">
                  <Card 
                        card={actionCards[1]}
                        style={{
                          "aspectRatio": "sm:aspect-h-1 sm:aspect-w-1"
                        }}
                  />
                </div>
              </div> */}
            {/* Row 3 End */}
        </main>
        <footer>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="border-t border-gray-200 py-8 text-sm text-gray-500 text-center sm:text-left">
              <span className="block sm:inline">&copy; 2022 Hamlet Homes ltd.</span>{' '}
              <span className="block sm:inline">All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
