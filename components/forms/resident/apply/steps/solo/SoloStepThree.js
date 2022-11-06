import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import SelectInput from '@/components/forms/inputs/SelectInput';
import * as Yup from "yup";

const incomeOptions = [
    { id: 1, value: '$30,000 - $35,000', title: '$30,000 - $35,000', description: '' },
    { id: 2, value: '$35,000 - $40,000', title: '$35,000 - $40,000', description: '' },
    { id: 3, value: '$40,000 - $45,000', title: '$40,000 - $45,000', description: '' },
    { id: 4, value: '$45,000 - $50,000', title: '$45,000 - $50,000', description: '' },
    { id: 5, value: '$50,000 - $55,000', title: '$50,000 - $55,000', description: '' },
    { id: 6, value: '$55,000 - $60,000', title: '$55,000 - $60,000', description: '' },
    { id: 7, value: '$60,000 - $65,000', title: '$60,000 - $65,000', description: '' },
    { id: 8, value: '$65,000 - $70,000', title: '$65,000 - $70,000', description: '' },
    { id: 9, value: '$70,000 - $75,000', title: '$70,000 - $75,000', description: '' },
    { id: 10, value: '$75,000 - $80,000', title: '$75,000 - $80,000', description: '' },
    { id: 11, value: '$80,000 - $85,000', title: '$80,000 - $85,000', description: '' },
    { id: 12, value: '$85,000 - $90,000', title: '$85,000 - $90,000', description: '' },
    { id: 13, value: '$90,000 - $95,000', title: '$90,000 - $95,000', description: '' },
    { id: 14, value: '$95,000 - $100,000', title: '$95,000 - $100,000', description: '' },
    { id: 15, value: '$100,000 - $110,000', title: '$100,000 - $110,000', description: '' },
    { id: 16, value: '$110,000 - $120,000', title: '$110,000 - $120,000', description: '' },
    { id: 17, value: '$120,000 - $130,000', title: '$120,000 - $130,000', description: '' },
    { id: 18, value: '$130,000 - $140,000', title: '$130,000 - $140,000', description: '' },
    { id: 19, value: '$140,000 - $150,000', title: '$140,000 - $150,000', description: '' },
    { id: 20, value: '$150,000 - $160,000', title: '$150,000 - $160,000', description: '' },
    { id: 21, value: '$160,000 - $170,000', title: '$160,000 - $170,000', description: '' },
    { id: 22, value: '$170,000 - $180,000', title: '$170,000 - $180,000', description: '' },
    { id: 23, value: '$180,000 - $190,000', title: '$180,000 - $190,000', description: '' },
    { id: 24, value: '$190,000 - $200,000', title: '$190,000 - $200,000', description: '' },
    { id: 25, value: '$200,000+', title: '$200,000+', description: '' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    income: Yup
    .string()
    .required("Please select an income band")
    })  

const SoloStepThree = (props) => {

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
            <SelectInput 
            name={"income"} 
            label={"Annual Income"}
            selected={values.income}
            options={incomeOptions}
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

export default SoloStepThree;