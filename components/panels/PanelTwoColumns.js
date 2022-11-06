import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function PanelTwoColumns({panels}) {

    return (
      <>
        <div className="mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* panel */}
                {panels.map((panel) => (
                <div key={panel.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                            <CheckBadgeIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">{panel.primaryContent}</dt>
                                <dd>
                                <div className="text-lg font-medium text-gray-900">{panel.secondaryContent}</div>
                                </dd>
                            </dl>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </>
    
    )                
}