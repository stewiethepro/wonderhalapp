import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import RadioInputThree from '@/components/forms/inputs/RadioInputThree';

const groupOptions = [
    { id: 1, value: false, title: 'On my own', description: '' },
    { id: 2, value: true, title: 'With others', description: '' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    group: Yup
    .bool()
    .required("Please select how you are applying"),
});

const StepOne = (props) => {

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
            <RadioInputThree 
            name={"group"}
            label={"I will be renting this home..."}
            selected={props.data.group}
            options={groupOptions}
            requiredAsterisk
            />
        </div>

        <div className='mt-8 flex justify-between'>
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

export default StepOne;