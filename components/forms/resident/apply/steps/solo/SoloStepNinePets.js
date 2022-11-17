import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import { Tab } from '@headlessui/react'
import TextInput from '@/components/forms/inputs/TextInput';
import TextAreaInput from '@/components/forms/inputs/TextAreaInput';
import SelectInput from '@/components/forms/inputs/SelectInput';
import { PlusCircleIcon, MinusCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const animalsOptions = [
    { id: 0, value: 'dog', title: '🐶 Dog', description: '' },
    { id: 1, value: 'cat', title: '🐱 Cat', description: '' },
    { id: 2, value: 'other', title: '🐘 Other', description: '' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    pets: Yup.array().of(Yup.object().shape({
        name: Yup
        .string()
        .required("Please enter your pet's name"),
        animal: Yup
        .string()
        .required("Please choose what type of pet you have"),
        breed: Yup
        .string()
        .required("Please enter your pet's breed"),
        age: Yup
        .number("Please enter a number")
        .required("Please enter your pet's age"),
        additionalInfo: Yup
        .string()
        .max(500, "You've exceeded the maximum character limit of 500.")
        })).min(1, "Please add at least one pet"),
    })


const StepNine = (props) => {

const handleSubmit = (values) => {
    props.next(values);
};
                
const [selectedIndex, setSelectedIndex] = useState(0)
const [maxPets, setMaxPets] = useState(false)

return (
    <>

    <Formik
    validationSchema={yupValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    {({values, errors, touched, setFieldValue}) => (

        <Form autoComplete="off">
        
        <FieldArray name='pets'>
            {({push, remove}) => {
            console.log(values);
            console.log("errors: ", errors);
            console.log("touched: ", touched);
                return (
                <div>

                <div className="w-full max-w-2xl mx-auto  lg:max-w-none lg:mt-0 lg:col-span-4">

                    <div className='w-full -mt-4 max-w-2xl mx-auto lg:max-w-none lg:col-span-4'>
                        <div className={`${values.pets.length === 3 && 'hidden'} mt-8 sm:col-span-2`}>
                            <button type='button' onClick={() => {
                            if (values.pets.length === 1 || values.pets.length === 2) {
                                setSelectedIndex((prev) => prev + 1)
                                push({
                                    name: "",
                                    animal: "",
                                    breed: "",
                                    age: 0,
                                    additionalInfo: "",
                                })
                            } else if (values.pets.length === 0) {
                                setSelectedIndex(0)
                                push({
                                    name: "",
                                    animal: "",
                                    breed: "",
                                    age: 0,
                                    additionalInfo: "",
                                })
                            } else {
                                setMaxPets(true)
                            }
                            }} 
                            className="inline-flex w-full items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                                <span className='mr-4 text-indigo-500'>
                                    <PlusCircleIcon className="flex-shrink-0 h-6 w-6"/>
                                </span>
                                {values.pets.length === 0 ? 
                                "Add pet"
                                :
                                "Add another pet"
                                }
                            </button>
                        </div>
                    </div>

                    {errors.pets && touched.pets && errors.pets.constructor === Array && 
                    <div>
                    
                    <div className="rounded-md mt-4 bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Check the pets below for missing info
                                    </h3>
                                    <ul role="list" className="text-sm font-medium">
                                    {errors.pets.map((pet, index) => ( 
                                    <>  
                                        {((typeof pet === "undefined") || (typeof touched.pets[index] === "undefined" )) ? 
                                        null
                                        : 
                                        <>
                                            {errors.pets[index] &&
                                                <li>
                                                    <div className="">
                                                        <p className="text-sm text-red-500">
                                                            {values.pets[index].name? values.pets[index].name : "Pet " + (index + 1)} 
                                                        </p>
                                                    </div>
                                                </li>
                                            }
                                        </>
                                        }
                                    </>
                                    ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    <Tab.Group as="div" selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                    <div className={`${values.pets.length === 0 ? "" : "border-b border-gray-200"}`}>
                        <Tab.List className="-mb-px flex space-x-8">
                            {values.pets.map((pet, index) => (
                                <Tab 
                                    key={index}
                                    className={({ selected }) =>
                                    classNames(
                                        selected
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                                        'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                                    )
                                    }
                                >
                                    {!values.pets[index].name ? 
                                    "Pet " + (index + 1) 
                                    : 
                                    values.pets[index].name
                                    }
                                </Tab>
                            ))}       
                        </Tab.List>
                    </div>
                    <Tab.Panels as={Fragment}>
                        {values.pets.map((pet, index) => (
                            <Tab.Panel className="mb-10">
                                <div key={index} className="mt-4">
                                    
                                    <div className="sm:col-span-2">
                                        <SelectInput 
                                        name={`pets.${index}.animal`}
                                        label={"Animal"}
                                        requiredAsterisk={true}
                                        selected={values.pets[index].animal}
                                        options={animalsOptions}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4"> 
                                        <div className="mt-4 sm:col-span-2">
                                            <TextInput 
                                            name={`pets.${index}.name`}
                                            label={"Name"}
                                            requiredAsterisk={true}
                                            />
                                        </div>

                                        <div>
                                            <TextInput 
                                            name={`pets.${index}.breed`}
                                            label={"Breed"}
                                            requiredAsterisk={true}
                                            />
                                        </div>

                                        <div>
                                            <TextInput 
                                            name={`pets.${index}.age`}
                                            label={"Age"}
                                            type={"number"}
                                            requiredAsterisk={true}
                                            />
                                        </div>

                                        <div className="mt-4 sm:col-span-2">
                                            <TextAreaInput 
                                            name={`pets.${index}.additionalInfo`}
                                            label={"Additional Info"}
                                            type="textarea"
                                            message={values.pets[index].additionalInfo}
                                            setFieldValue={setFieldValue}
                                            minLength={0}
                                            maxLength={500}
                                            />
                                        </div>

                                    </div>
                                        <div className="mt-5 sm:col-span-2">
                                            <button type='button' onClick={() => {
                                                if (values.pets.length === 1) {
                                                    setSelectedIndex(0)    
                                                } else {
                                                    setSelectedIndex((prev) => prev - 1)
                                                }
                                                remove(index)
                                            }} 
                                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-rose-600 bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 text-sm">
                                                <span className='text-red-500'>
                                                <MinusCircleIcon className="flex-shrink-0 mr-4 h-6 w-6"/>
                                                </span>
                                                Remove {!values.pets[index].name ? 
                                                " Pet " + (index + 1) 
                                                : 
                                                values.pets[index].name
                                                }
                                            </button>
                                        </div>
                                </div>    
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                    </Tab.Group>
                </div> 
               
            </div>
                
                )
            }}
        </FieldArray>

        {errors.pets && touched.pets && typeof errors.pets === "string" && 
        <div>
        <p className="mt-2 text-sm text-red-600">
            {errors.pets}
        </p>
        </div>
        }
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

export default StepNine;