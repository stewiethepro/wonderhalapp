import { useState } from 'react'
import { Formik, Form, useFormikContext } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import TextInput from '@/components/forms/inputs/TextInput';


const yupValidationSchema = Yup.object().shape({
    birthday: Yup
    .date("Not a date")
    .min(new Date(1900, 0, 1), "Too old")
    .max(new Date(2010, 0, 1), "Too young")
    .required("Date of birth is required")
});

const GroupStepSeven = (props) => {

const handleSubmit = (values) => {
    props.next(values);
};

const today = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear(); 
    var todayFormatted = yyyy + '/' + mm + '/' + dd;
    return todayFormatted
}


return (
    <>
    <Formik
    validationSchema={yupValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    {({values}) => (
        <Form>
        <div className='my-16'>
            <div className='my-10'>
            <TextInput 
            name={"birthday"}
            label={"Date of Birth"}
            type="date"
            min="1900/01/01"
            max="2022/01/01"
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

export default GroupStepSeven;