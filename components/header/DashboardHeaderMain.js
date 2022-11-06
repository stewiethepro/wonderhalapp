import { ClockIcon } from "@heroicons/react/24/outline"

export default function DashboardHeaderMain ({ data }) {
    const {title, main, button} = data
    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)
    const todayString = today.toDateString()
    console.log(todayString);

    return (
        <>
            <div className="bg-indigo-50 rounded-xl mb-4">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl md:tracking-tight">
                    <span className="block text-indigo-600">{main}</span>
                    </h2>
                    <div className="mt-4 flex lg:flex-shrink-0 items-center">
                    <ClockIcon className="block mr-2 h-6 w-6 text-indigo-500"/>
                    <h2 className="text-base font-medium text-indigo-500">
                      {todayString}
                    </h2>
                    </div>
                </div>
            </div>
        </>
    )
  }
  