import { useState } from 'react'
import { Formik, Form } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import TextInput from '@/components/forms/inputs/TextInput';
import RadioInput from '@/components/forms/inputs/RadioInput';

const options = [
    { id: 1, value: false, title: 'No', description: '' },
    { id: 2, value: true, title: 'Yes', description: '' },
  ];

const hiddenInputs = [
    <TextInput key={"First Name"} name={"previousName.firstName"} label={"First Name"}/>,
    <TextInput key={"Middle Names"} name={"previousName.middleNames"} label={"Middle Names"}/>,
    <TextInput key={"Last Name"} name={"previousName.lastName"} label={"Last Name"}/>,
]

const yupValidationSchema = Yup.object().shape({
changedName: Yup.boolean(),
previousName: Yup.object().when("changedName", {
    is: (changedName) => !changedName,
    then: Yup.object().shape({
        firstName: Yup
        .string(),
        middleNames: Yup
        .string(),
        lastName: Yup
        .string(),
    }),
    otherwise: Yup.object().shape({
        firstName: Yup
        .string("First name shoud be a string")
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'First name should be a string')
        .required("First name is required"),
        middleNames: Yup
        .string("Middle name shoud be a string")
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'Middle name should be a string'),
        lastName: Yup
        .string("Last name shoud be a string")
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, 'Last name should be a string')
        .required("First name is required"),
    }),
  }),
});

const GroupStepSix = (props) => {

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
            <div className='my-10'>
            <RadioInput 
            name={"changedName"}
            selected={props.data.changedName}
            options={options}
            hiddenInputs={hiddenInputs}
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

export default GroupStepSix;