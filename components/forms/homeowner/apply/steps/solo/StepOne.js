import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import RadioInputThree from '@/components/forms/inputs/RadioInputThree';

const homeownerTypeOptions = [
    { id: 1, value: 'solo', title: '1 - 3', description: '' },
    { id: 2, value: 'investor', title: '4 - 9', description: '' },
    { id: 3, value: 'institution', title: '10+', description: '' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    homeownerType: Yup
    .string()
    .oneOf(['solo', 'investor', 'institution'], "Please select the number of homes you are listing")
    .required("Please select the number of homes you are listing"),
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
            name={"homeownerType"}
            label={"How many homes do you have to let?"}
            selected={props.data.homeownerType}
            options={homeownerTypeOptions}
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