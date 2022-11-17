import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import RadioInput from '@/components/forms/inputs/RadioInput';

const inviteNowOptions = [
    { id: 1, value: true, title: 'Invite now', description: '' },
    { id: 2, value: false, title: 'Invite later', description: '' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    inviteNow: Yup
    .boolean()
    .required("Please choose whether you want to invite your flatmates now or later"),
});

const GroupStepEleven = (props) => {

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
            <RadioInput 
            name={"inviteNow"}
            selected={props.data.inviteNow}
            options={inviteNowOptions}
            requiredAsterisk
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

export default GroupStepEleven;