import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

  export default function CardGridHomes({data, homeApplications}) {
    
    const homes = data
    const homesAppliedTo = homeApplications.map(homeApplication => homeApplication.home_id)

    console.log("homesAppliedTo :", homesAppliedTo);

    homes.map((home) => {
      homesAppliedTo.includes(home.id) ? home.hasApplied = true : home.hasApplied = false
    })

    console.log(data);
    console.log("homes: ", homes);

  return (
      <>
        <h2 className="sr-only">Homes</h2>

        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {homes.map((home) => (
            <div
              key={home.id}
              className="group relative bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col overflow-hidden transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300"
            >
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-90 sm:aspect-none sm:h-96">
                <img
                  src={home.homes_images[0].src}
                  alt={home.homes_images[0].alt}
                  className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                />
              </div>
              <div className="flex-1 p-4 space-y-1 flex flex-col">
                <h3 className="text-sm font-semibold text-indigo-600">
                  <Link href={home.href}>
                  <a>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {home.street_address}
                  </a>
                  </Link>
                </h3>
                <h3 className="text-sm font-medium text-gray-600">
                  {home.title}
                </h3>
                {home.hasApplied &&
                  <div className="mt-2 flex items-center text-sm text-green-500">
                    <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                    Applied
                  </div>
                }
                <p className="text-sm text-gray-900">{home.options}</p>
                <p className="text-sm text-gray-500">{home.summary}</p>
                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-base font-medium text-gray-900">${home.price} / week</p>
                </div>
              </div>
            </div>
          ))}
        </div>
       </>
  )
}
