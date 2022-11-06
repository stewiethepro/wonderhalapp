import AppNav from '@/components/nav/AppNav'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AppLayout({ children, data, navData }) {
  return (
    <>
      <div className="max-h-screen">
        <AppNav data={data} navData={navData}/>
        <main>
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 mt-12">
             { children }
          </div>
        </main>
      </div>
    </>
  )
}

export const getLayout = (page, {data, navData}) => <AppLayout data={data} navData={navData} >{page}</AppLayout>;