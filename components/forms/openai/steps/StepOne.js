import { useState } from 'react'
import { Formik, Form, useFormikContext } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import TextAreaInput from '@/components/forms/inputs/TextAreaInput';

const yupValidationSchema = Yup.object().shape({
    prompt: Yup
    .string()
    .min(1, "Please enter at least 1 character.")
    .max(5000, "You've exceeded the maximum character limit of 5000.")
    .required("A prompt is required")
});

const StepOne = (props) => {

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
        <div className='my-16'>
            <div className='my-10'>
            <TextAreaInput 
            name={"prompt"}
            label={"Prompt"}
            type="textarea"
            message={values.prompt}
            setFieldValue={setFieldValue}
            minLength={1}
            maxLength={5000}
            />
            </div>
        </div>
        <div className='mt-8 flex justify-between'>
            <button
            type={"submit"}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Ask Open AI
            </button>
        </div>
        </Form>
    )}
    </Formik>
    </>
)
}

export default StepOne;