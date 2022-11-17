import React from "react";
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useField } from "formik";
import { useState, useEffect } from "react";

export default function TextAreaInput( props ) {
  const [field, meta, helpers] = useField(props.name)
  const invalid = meta.error && meta.touched
  const { setValue } = helpers;
  const setFieldValue = props.setFieldValue

  const [message, setMessage] = useState(props.message);

  const handleMessageChange = event => {
    // 👇️ access textarea value
    setMessage(event.target.value);
    setFieldValue(props.name, event.target.value)
    console.log(event.target.value);
  };

  return (
    <div className="mt-2 input-wrapper">
      {props.label && <label htmlFor={props.name} className={`${props.requiredAsterisk && "after:content-['*'] after:ml-0.5 after:text-red-500"} block text-sm font-medium text-gray-700`}>
          {props.label}
      </label>}
      <div className="mt-1 relative rounded-md shadow-sm
     ">
        <textarea
          rows={4}
          name={props.name}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={message}
          onChange={handleMessageChange}
          minLength={props.minLength}
          maxLength={props.maxLength}
        />
      </div>
      <div className="ml-auto flex items-center mt-4">
        <div className="flex items-center">
            <h3 className={`${(message.length < props.minLength && "text-red-600")} text-sm`}>{message.length} / {props.maxLength} characters </h3>
        </div>
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

  