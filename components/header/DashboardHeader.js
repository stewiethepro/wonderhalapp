import Link from "next/link"

export default function DashboardHeader({ headerContent }) {
    const {title, main, description, button} = headerContent
    return (
        <>
            <div className="flex-shrink-0 my-auto mb-8">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                    {title}
                </p>
                <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tighter">
                    {main}
                </h1>
                <p className="mt-2 text-base text-gray-500">
                    {description}
                </p>
            </div>
        </>
    )
  }