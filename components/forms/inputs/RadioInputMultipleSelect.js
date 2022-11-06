import React from "react";
import { useState } from 'react';
import { useField } from "formik";
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function RadioInputMultipleSelect( props ) {
  const {options, hiddenInputs} = props
  const [selected, setSelected] = useState(props.selected)
  const [field, meta, helpers] = useField(props.name)
  const { setValue } = helpers;
  console.log(props.selected);

  return (
    <>
    <div className="space-y-1 input-wrapper">
        <RadioGroup value={selected} onChange={setSelected} name={props.name} 
      >


            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {options.map((option) => (
                <RadioGroup.Option
                    key={option.id}
                    value={option.value}
                    onClick={() => setValue(option.value)}
                    className={({ checked, active }) =>
                      classNames(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active ? 'border-indigo-500 ring-2 ring-indigo-500' : '',
                        'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                      )
                    }
                >
                    {({ checked, active }) => (
                    <>
                        <span className="flex-1 flex">
                        <span className="flex flex-col">
                            <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                            {option.value}
                            </RadioGroup.Label>
                            {option.description && <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                            {option.description}
                            </RadioGroup.Description>}
                        </span>
                        </span>
                        <CheckCircleIcon
                        className={classNames(!checked ? 'invisible' : '', 'h-5 w-5 text-indigo-600')}
                        aria-hidden="true"
                        />
                        <span
                        className={classNames(
                            active ? 'border' : 'border-2',
                            checked ? 'border-indigo-500' : 'border-transparent',
                            'absolute -inset-px rounded-lg pointer-events-none'
                        )}
                        aria-hidden="true"
                        />
                    </>
                    )}
                </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    </div>

    {hiddenInputs && selected &&
      <>
        {hiddenInputs.map((hiddenInput) => (
          hiddenInput
        ))}
      </>
    }
    </>
  )
}

