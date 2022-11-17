import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const groupOptions = [
    { id: 1, value: false, title: 'On my own', description: '' },
    { id: 2, value: true, title: 'With others', description: '' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    group: Yup
    .boolean()
    .required("Please select whether you will be renting alone or not"),
  });

const SoloStepEleven = (props) => {

const handleSubmit = (values) => {
    props.next(values, true);
};
        

return (
    <>

    <Formik
    validationSchema={yupValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    {({values, errors, touched}) => (

        <Form autoComplete="off">
        
        <div className="flex-1 space-y-2 flex flex-col">
            <p className="text-base text-gray-500">
            Next steps will be a quick 15 minute video call with the Hamlet team to complete your application.
            </p>
            <p className="text-base text-gray-500">
            We'll go over how Hamlet works and any questions you may have.
            </p>
            <p className="text-base text-gray-500">
            Click book now to lock in your 
            <span className='font-semibold text-indigo-500'> ${values.budget} / week </span> 
            pre-approval and open the booking page.
            </p>
            <div className='py-6'>
                <div className="rounded-md bg-indigo-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-blue-700">
                            This meeting is required in order to be approved as a Hamlet resident.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
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
            Book now
            </button>
        </div>
        </Form>
    )}
    </Formik>

    </>
)
}

export default SoloStepEleven;