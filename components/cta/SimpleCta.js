/* This example requires Tailwind CSS v2.0+ */
export default function SimpleCta({ data }) {
    return (
        <>
              <div className="mt-6 mx-4 relative py-12 flex items-center sm:pt-16 lg:mt-0">
                <div className="absolute inset-0 bg-indigo-50 rounded-lg" />
                <div className="relative max-w-sm mx-auto text-center">
                  <h3 className="text-2xl font-extrabold tracking-tight text-indigo-500">Welcome to your Hamlet account.</h3>
                  <p className="mt-2 text-gray-600">
                    Click here to start your tour of the app.{' '}
                    <a href="#" className="font-bold text-indigo-500 whitespace-nowrap hover:text-gray-200">
                      Go now<span aria-hidden="true"> &rarr;</span>
                    </a>
                  </p>
                </div>
              </div>
        </>
    )
  }
  