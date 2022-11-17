import { useState } from 'react'
import { Formik, Form, useFormikContext } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import TextAreaInput from '@/components/forms/inputs/TextAreaInput';

const yupValidationSchema = Yup.object().shape({
    bio: Yup
    .string()
    .min(150, "Please write at least 150 characters.")
    .max(500, "You've exceeded the maximum character limit of 500.")
    .required("A short bio is required")
});

const SoloStepSeven = (props) => {

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
    {({values, setFieldValue}) => (
        <Form>
        <div className='my-16'>
            <div className='my-10'>
            <TextAreaInput 
            name={"bio"}
            label={"Bio"}
            type="textarea"
            message={values.bio}
            setFieldValue={setFieldValue}
            minLength={150}
            maxLength={500}
            />
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
            Next
            </button>
        </div>
        </Form>
    )}
    </Formik>
    </>
)
}

export default SoloStepSeven;