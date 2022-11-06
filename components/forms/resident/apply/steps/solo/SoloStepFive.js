import { useState } from 'react'
import { Formik, Form, useFormikContext } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import TextInput from '@/components/forms/inputs/TextInput';
import CheckboxInput from '@/components/forms/inputs/CheckboxInput';

const yupValidationSchema = Yup.object().shape({
    name: Yup.object().shape({
        firstName: Yup
        .string("First name shoud be a string")
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'First name must be a string')
        .required("First name is required"),
        middleNames: Yup
        .string("Middle name shoud be a string")
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'First name must be a string'),
        lastName: Yup
        .string("Last name shoud be a string")
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'Last name must be a string')
        .required("Last name is required"),
    }),
    legalName: Yup
    .bool()
    .oneOf([true], 'Please confirm that this is your legal name')
});

const SoloStepFive = (props) => {

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
    {({values}) => (
        <Form>
        <div className='my-16'>
            <div className='my-8'>
            <TextInput 
            name={"name.firstName"}
            label={"First Name"}
            />
            </div>
            <div className='my-8'>
            <TextInput 
            name={"name.middleNames"}
            label={"Middle Names (optional)"}
            />
            </div>
            <div className='my-8'>
            <TextInput 
            name={"name.lastName"}
            label={"Last Name"}
            />
            </div>
            <div className='my-12'>
            <CheckboxInput
            name={"legalName"}
            label={"This is my full legal name"}    
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

export default SoloStepFive;