import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import ConditionalSelectMultipleInput from '@/components/forms/inputs/ConditionalSelectMultipleInput';

const locationsOptions = [
    { id: 1, value: 'Funnyville', title: 'Funnyville', description: '' },
    { id: 2, value: 'Sillytown', title: 'Sillytown', description: '' },
    { id: 3, value: 'Ciudad de los MuchoMucho', title: 'Ciudad de los MuchoMucho', description: '' },
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

const SoloStepTest = (props) => {

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
            label={"Where are you looking to rent?"}
            selected={props.data.locations}
            options={locationsOptions}
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

export default SoloStepTest;