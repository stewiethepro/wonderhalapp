import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import RadioInputThree from '@/components/forms/inputs/RadioInputThree';
import Flatmates from '@/pages/resident/flatmates';
import Link from "next/link"

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    residentGroupId: Yup
    .string()
    .required("Please select a group"),
});

const StepTwo = (props) => {

const {applicantData} = props
const {groups} = applicantData

const residentGroupOptions = []

groups.map((group, index) => {

    // let groupDescription = ""

    let flatmateNames = []

    group.flatmates.map((flatmate) => {
        flatmateNames.push(flatmate.firstName)
    })

    let firstNames = flatmateNames.join(', ').replace(/,(?!.*,)/gmi, ' and ')

    residentGroupOptions.push({
        id: index, 
        value: group.groupId, 
        title: 'Group ' + group.groupId, 
        description: firstNames
    });
})

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
        
        <div className="flex-1 space-y-2 flex flex-col">
        {groups.length < 1 ? 
        <>
            {applicantData.resident.isApproved ? 
            <>
                <p className="text-base text-gray-500">
                You are not currently in any groups.
                </p>
                <p className="text-base text-gray-500">
                Click the button below to invite your flatmates to join Hamlet.
                </p>
            </>
            : 
            <>
                <p className="text-base text-gray-500">
                To apply for Hamlet homes, each member of your group needs to apply to become a Hamlet resident. Once approved, your group can apply for any Hamlet Home in three clicks.
                </p>
                <p className="text-base text-gray-500">
                Click the button below to start your application, you'll have the chance to add your flatmates and invite them to join Hamlet.
                </p>
            </>
            }  
        </>
        : 
        <>
            <RadioInputThree 
            name={"residentGroupId"}
            label={"Applicant group"}
            selected={props.data.residentGroupId}
            options={residentGroupOptions}
            requiredAsterisk
            />
        </>
        }    
        </div>

        <div className='mt-8 flex justify-between'>
            <button
            type={"button"}
            onClick={() => props.prev(values)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Back
            </button>

            {groups.length < 1 ? 
            <>
                {applicantData.resident.isApproved ? 
                <>
                    <Link href="/resident/flatmates">
                        <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Add flatmates
                        </button>
                    </Link>
                </>
                :
                <>
                    <Link href="/resident/apply">
                        <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Become a resident
                        </button>
                    </Link>
                </>
                }
            </>
            :
            <>
                <button
                type={"submit"}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Next
                </button>
            </>
            }
        </div>
        </Form>
    )}
    </Formik>

    </>
)
}

export default StepTwo;