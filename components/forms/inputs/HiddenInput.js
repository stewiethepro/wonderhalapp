import React from "react";
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useField } from "formik";

export default function HiddenInput( props ) {
  const [field, meta, helpers] = useField(props.name)

  return (
    <input
      {...field}
      {...props}
      type={props.type}
      className="hidden"
      />  
  )
}

  