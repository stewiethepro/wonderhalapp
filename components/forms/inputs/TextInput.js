import React from "react";
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useField } from "formik";

export default function TextInput( props ) {
  const [field, meta, helpers] = useField(props.name)
  const invalid = meta.error && meta.touched

  return (
    <div className="mt-2 input-wrapper">
      {props.label && <label htmlFor={props.name} className={`${props.requiredAsterisk && "after:content-['*'] after:ml-0.5 after:text-red-500"} block text-sm font-medium text-gray-700`}>
          {props.label}
      </label>}
      <div className="mt-1 relative rounded-md shadow-sm
     ">
        <input
          {...field}
          {...props}
          type={props.type}
          value={props.value}
          className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 focus:ring-1 focus:outline-none
          ${meta.error && meta.touched ? 
            'border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500' 
            : 
            'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
        {meta.error && meta.touched && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>}
      </div>
      {meta.error && meta.touched && 
      <div>
        <p className="mt-2 text-sm text-red-600">
          {meta.error}
        </p>
      </div>
      }
    </div>
  )
}

  