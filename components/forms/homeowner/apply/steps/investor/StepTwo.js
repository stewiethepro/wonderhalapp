import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import { Tab } from '@headlessui/react'
import TextInput from '@/components/forms/inputs/TextInput';
import ConditionalSelectMultipleInput from '@/components/forms/inputs/ConditionalSelectMultipleInput';
import { PlusCircleIcon, MinusCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline'

const locationsOptions = [
    { id: 1, value: 'Auckland', title: 'Auckland', description: '' },
    { id: 2, value: 'Wellington', title: 'Wellington', description: '' },
    { id: 3, value: 'Tauranga', title: 'Tauranga', description: '' },
    { id: 4, value: 'Nelson', title: 'Nelson', description: '' },
    { id: 5, value: 'Christchurch', title: 'Christchurch', description: '' },
    { id: 6, value: 'Dunedin', title: 'Dunedin', description: '' },
    { id: 7, value: 'Queenstown', title: 'Queenstown', description: '' },
    { id: 8, value: 'Other', title: 'Other', description: '' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    locations: Yup
    .array()
    .required("Please enter at least one location or choose other if not among options")
    .min(1, "Please enter at least one location or choose other if not among options"),
    })

const StepTwo = (props) => {

const handleSubmit = (values) => {
    props.next(values);
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

        <div className='my-10'>
            <ConditionalSelectMultipleInput 
            name={"locations"}
            label={"Where are your homes located?"}
            selected={props.data.locations}
            options={locationsOptions}
            />
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
            Next
            </button>
        </div>
        </Form>
    )}
    </Formik>

    </>
)
}

export default StepTwo;