import React from "react";
import { useState } from 'react';
import { useField } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function CheckboxInput( props ) {

  const [field, meta] = useField({ name: props.name, type: props.type });

  return (
    <>
    <div className="relative">
      <input
        {...field}
        type="checkbox"
        checked={field.value}
        className={`h-4 w-4 text-indigo-600 rounded
          ${meta.error && meta.touched ? 
            'border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500' 
            : 
            'border-gray-300 focus:ring-indigo-500' 
          }
        `}
      />
      <label htmlFor={props.name} className={`ml-2 align-middle text-sm font-medium
        ${meta.error && meta.touched ? 
          'text-pink-600' 
          : 
          'text-gray-900'
        }
      `}
      >
        {props.label}
      </label>
    </div>
      {meta.error && meta.touched && 
      <div className="rounded-md mt-4 bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{meta.error}</h3>
          </div>
        </div>
      </div>
      }  
    </>
  )

}