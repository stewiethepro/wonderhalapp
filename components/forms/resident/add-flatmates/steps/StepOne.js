import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import TextInput from '@/components/forms/inputs/TextInput';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { get } from '@/utils/api/request';
import ButtonSpinner from '@/components/forms/utility/ButtonSpinner';

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    flatmates: Yup.array().of(Yup.object().shape({
        firstName: Yup
        .string()
        .required("Please enter a first name"),
        email: Yup
        .string()
        .email("Please enter a valid email address")
        .required("Please enter an email"),
        })).min(1, "Please add at least one flatmate"),
    })

const StepOne = (props) => {

const request = {};

const checkUser = async (request, values, props) => {
	try {
		await get('/api/supabase/profiles/get', request).then((result) => {
            const data = result
            console.log("API result: ", data);

            data.map((flatmate, index) => {
                const {email, userExists, userId, userStatus, lastName, budget} = flatmate
                if (userExists) {
                    console.log(email + " is an existing user");
                    values.flatmates[index].userExists = true
                    values.flatmates[index].userId = userId
                    values.flatmates[index].userStatus = userStatus
                    values.flatmates[index].lastName = lastName
                    values.flatmates[index].budget = budget
                } else {
                    console.log(email + " is not an existing user");
                    values.flatmates[index].userExists = false
                }
            })
            props.next(values, true);
        })
	} catch (err) {
		console.log("API error: ", err);
	}
};

const handleSubmit = (values) => {
    values.flatmates.map((flatmate, index) => {
        let key = 'email' + (index + 1)
        let value = flatmate.email
        request[key] = value
    })
    console.log('submit handled');
    props.submitting()
    console.log('userRequest: ', request);
    checkUser(request, values, props)
};

return (
    <>

    <Formik
    validationSchema={yupValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    {({values, errors, touched, isSubmitting}) => (

        <Form>
        
        <FieldArray name='flatmates'>
            {({push, remove}) => {
            console.log(values);
            console.log("errors: ", errors);
            console.log("touched: ", touched);
                return (
                <div>

                <div className="space-y-6 py-6 sm:space-y-0 sm:py-0">

                        {values.flatmates.map((flatmate, index) => (
                                <div key={index} className="mt-4">
                                    
                                    <div className="space-y-1 px-4 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5 grid grid-cols-1 gap-y-4 sm:grid-cols-2"> 
                                        <div>
                                            <TextInput 
                                            name={`flatmates.${index}.firstName`}
                                            label={"First Name"}
                                            requiredAsterisk={true}
                                            />
                                        </div>
                                        <div>
                                            <TextInput 
                                            name={`flatmates.${index}.email`}
                                            label={"Email"}
                                            requiredAsterisk={true}
                                            />
                                        </div>
                                    </div>
                                        <div className="mt-5 flex justify-center sm:col-span-2">
                                            <button type='button' onClick={() => {remove(index)}} 
                                            className="sm:w-1/3 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm">
                                                <span className='text-red-500'>
                                                <MinusCircleIcon className="flex-shrink-0 mr-4 h-6 w-6"/>
                                                </span>
                                                Remove {!values.flatmates[index].firstName ? 
                                                " flatmate " + (index + 1) 
                                                : 
                                                values.flatmates[index].firstName
                                                }
                                            </button>
                                        </div>
                                </div>    
                        ))}
                
                <div className='w-full -mt-4 max-w-2xl mx-auto lg:max-w-none lg:col-span-4'>
                    <div className={`${values.flatmates.length === 10 && 'hidden'} my-5 flex justify-center sm:col-span-2`}>
                        <button type='button' onClick={() => {
                            push({
                                firstName: "",
                                lastName: "",
                                email: "",
                                userExists: false,
                                userId: null,
                                userStatus: null,
                                budget: 0,
                            })
                        }} 
                        className="inline-flex sm:w-1/3 items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm">
                            <span className='mr-4 text-indigo-500'>
                                <PlusCircleIcon className="flex-shrink-0 h-6 w-6"/>
                            </span>
                            {values.flatmates.length === 0 ? 
                            "Add flatmate"
                            :
                            "Add another flatmate"
                            }
                        </button>
                    </div>
                </div>

                </div> 
               
            </div>
                
                )
            }}
        </FieldArray>

        {errors.flatmates && touched.flatmates && typeof errors.flatmates === "string" && 
        <div>
        <p className="mt-2 text-sm text-red-600">
            {errors.flatmates}
        </p>
        </div>
        }
        
        <div className="flex flex-shrink-0 justify-end px-4 py-4">
            <div className="flex justify-end space-x-3">
            <button
                type={"submit"}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
            {isSubmitting &&
            <ButtonSpinner />
            }
                Invite flatmates
            </button>
            </div>
        </div>
        
        </Form>
    )}
    </Formik>

    </>
)
}

export default StepOne;