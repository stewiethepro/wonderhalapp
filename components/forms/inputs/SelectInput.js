/* This example requires Tailwind CSS v2.0+ */
import React from "react";
import { useField } from "formik";
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SelectInput( props ) {
    const options = props.options
    const [selected, setSelected] = useState(props.selected)
    const [field, meta, helpers] = useField(props.name)
    const { setValue } = helpers;

    const selectedOption =  options.filter(function(option) {
      return option.value == selected;
    });
    const selectedTitle = selectedOption.length > 0 ? selectedOption[0].title : ""

  return (
    <>
    <div className="space-y-1 mt-2 input-wrapper">
    <Listbox value={selected} onChange={setSelected} name={props.name}>
      {({ open }) => (
        <>
          <Listbox.Label className={`${props.requiredAsterisk && "after:content-['*'] after:ml-0.5 after:text-red-500"} block text-sm font-medium text-gray-700`}>{props.label}</Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="block truncate">{selected? selectedTitle : "Select " + props.label}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option.value}
                    onClick={() => setValue(option.value)}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9'
                      )
                    }
                  > 
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {option.title}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
    </div>

    {meta.error && meta.touched && 
      <div>
        <p className="mt-2 text-sm text-red-600">
          {meta.error}
        </p>
      </div>
    }       
    </>                   

  )
}
