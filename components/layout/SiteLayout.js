import SiteNav from '@/components/nav/SiteNav'
import Footer from '@/components/layout/Footer'


export default function SiteLayout({ children }) {
  return (
    <div className="bg-white">
      <header>
      <SiteNav/>
      </header>
      <main>
        { children }
      </main>
      <Footer/>
    </div>
  )
}

export const getLayout = (page) => <SiteLayout>{page}</SiteLayout>;
