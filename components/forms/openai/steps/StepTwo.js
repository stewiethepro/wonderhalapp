import { useState } from 'react'
import { Formik, Form, useFormikContext } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import TextAreaInput from '@/components/forms/inputs/TextAreaInput';

const yupValidationSchema = Yup.object().shape({
    prompt: Yup
    .string()
    .min(1, "Please enter at least 1 character.")
    .max(500, "You've exceeded the maximum character limit of 500.")
    .required("A prompt is required")
});

const StepTwo = (props) => {

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
    {({values, setFieldValue}) => (
        <Form>
        <div className='mt-8 flex justify-between'>
            <button
            type={"button"}
            onClick={() => props.prev(values)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Ask again
            </button>
        </div>
        </Form>
    )}
    </Formik>
    </>
)
}

export default StepTwo;