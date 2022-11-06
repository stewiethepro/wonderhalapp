import { useState } from 'react'
import { useField } from "formik";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { Combobox } from '@headlessui/react'

const options = [
  { id: 1, value: 'Auckland' },
  { id: 2, value: 'Wellington' },
  { id: 3, value: 'Tauranga' },
  { id: 4, value: 'Napier' },
  { id: 5, value: 'Taupo' },
  { id: 6, value: 'Hamilton' },
  { id: 7, value: 'Nelson' },
  { id: 8, value: 'Christchurch' },
  { id: 9, value: 'Timaru' },
  { id: 10, value: 'Dunedin' },
  { id: 11, value: 'Queenstown' },
  { id: 12, value: 'Invercargill' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ComboboxInput( props ) {
  const [query, setQuery] = useState('')
  const [field, meta, helpers] = useField(props.name)
  const [selectedOption, setSelectedOption] = useState()
  const { setValue } = helpers;

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.value.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as="div" value={selectedOption} onChange={setSelectedOption} name={props.name}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">{props.label}</Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option) => option?.value}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option}
                onClick={() => setValue(option.value)}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>{option.value}</span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}