import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import { InformationCircleIcon } from '@heroicons/react/24/outline'


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const GroupStepThirteen = (props) => {

const handleSubmit = (values) => {
    props.next(values, true);
};
        

return (
    <>

    <Formik
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    {({values, errors, touched}) => (

        <Form autoComplete="off">
        
        <div className="flex-1 space-y-2 flex flex-col">
            <p className="text-base text-gray-500">
            Click 
            <span className='font-semibold text-indigo-500'> complete application </span> 
            to get pre-approved for 
            <span className='font-semibold text-indigo-500'> ${values.budget} / week</span>. 
            </p>
        </div>

        <div className='mt-8 flex justify-between'>
            <button
            type={"button"}
            onClick={() => props.prev(values)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Back
            </button>
            <button
            type={"submit"}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Complete application 
            </button>
        </div>
        </Form>
    )}
    </Formik>

    </>
)
}

export default GroupStepThirteen;