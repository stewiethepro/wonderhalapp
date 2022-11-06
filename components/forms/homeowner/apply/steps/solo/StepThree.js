import { useState, useCallback, useRef, Fragment } from 'react'
import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import { Tab } from '@headlessui/react'
import TextInput from '@/components/forms/inputs/TextInput';
import RadioInput from '@/components/forms/inputs/RadioInput';
import SelectInput from '@/components/forms/inputs/SelectInput';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const homeTypeOptions = [
    { id: 1, value: 'apartment', title: 'Apartment', description: '' },
    { id: 2, value: 'house', title: 'House', description: '' },
]
const bedroomsOptions = [
    { id: 1, value: 'studio', title: 'Studio', description: '' },
    { id: 2, value: '1', title: '1', description: '' },
    { id: 3, value: '2', title: '2', description: '' },
    { id: 4, value: '3', title: '3', description: '' },
    { id: 5, value: '4', title: '4', description: '' },
    { id: 6, value: '5+', title: '5+', description: '' },
]
const bathroomsOptions = [
    { id: 1, value: '1', title: '1', description: '' },
    { id: 2, value: '2', title: '2', description: '' },
    { id: 3, value: '3+', title: '3+', description: '' },
]
const furnishedOptions = [
    { id: 1, value: true, title: 'Furnished', description: '' },
    { id: 2, value: false, title: 'Unfurnished', description: '' },
]
const occupiedOptions = [
    { id: 1, value: true, title: 'Currently tenanted', description: '' },
    { id: 2, value: false, title: 'Not under contract', description: '' },
]
const managedOptions = [
    { id: 1, value: true, title: 'Property Manager', description: '' },
    { id: 2, value: false, title: 'Self-managed', description: '' },
]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const yupValidationSchema = Yup.object().shape({
    homes: Yup.array().of(Yup.object().shape({
            homeType: Yup
            .string()
            .required("Home type is required"),
            bedrooms: Yup
            .string()
            .required("Number of bedrooms is required"),
            bathrooms: Yup
            .string()
            .required("Number of bathrooms is required"),
            furnished: Yup
            .boolean()
            .required("Furnished status is required"),
            occupied: Yup
            .boolean()
            .required("Occupancy is required"),
            managed: Yup
            .boolean()
            .required("Management is required"),
            availableFrom: Yup
            .string()
            .required("Available from date is required"),
            }),
        ),
    })

const StepThree = (props) => {

const handleSubmit = (values) => {
    props.next(values);
};

const [selectedIndex, setSelectedIndex] = useState(0)

return (
    <>

    <Formik
    validationSchema={yupValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    
    {({values, errors, touched}) => (
        <Form>

            <div>
            <div className="w-full max-w-2xl mx-auto  lg:max-w-none lg:mt-0 lg:col-span-4">

                {errors.homes && touched.homes && errors.homes.constructor === Array && 
                    <div>
                    
                    <div className="rounded-md mt-4 bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Check the homes below for missing info
                                    </h3>
                                    <ul role="list" className="text-sm font-medium">
                                    {errors.homes.map((home, index) => ( 
                                    <>  
                                        {((typeof home === "undefined") || (typeof touched.homes[index] === "undefined" )) ? 
                                        null
                                        : 
                                        <>
                                            {errors.homes[index] &&
                                                <li>
                                                    <div className="">
                                                        <p className="text-sm text-red-500">
                                                            {values.homes[index].address.streetAddress? values.homes[index].address.streetAddress : "Home " + (index + 1)} 
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
                <div className={`${values.homes.length === 0 ? "" : "border-b border-gray-200"}`}>
                    <Tab.List className="-mb-px flex space-x-8">
                        {values.homes.map((home, index) => (
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
                                {!values.homes[index].address || values.homes[index].address.streetAddress === "" ? 
                                "Home " + (index + 1) 
                                : 
                                values.homes[index].address.streetAddress
                                }
                            </Tab>
                        ))}       
                    </Tab.List>
                </div>
                <Tab.Panels as={Fragment}>
                    {values.homes.map((home, index) => (
                        <Tab.Panel className="mb-10">
                            <div key={index} className="mt-4">
                                <div className="sm:col-span-2">
                                <div className='mt-4'>
                                <RadioInput 
                                name={`homes.${index}.homeType`} 
                                label={"Type of home"}
                                selected={values.homes[index].homeType}
                                options={homeTypeOptions}
                                requiredAsterisk
                                />
                                </div>
                                <div className='mt-4'>
                                <SelectInput 
                                name={`homes.${index}.bedrooms`} 
                                label={"Bedrooms"}
                                selected={values.homes[index].bedrooms}
                                options={bedroomsOptions}
                                requiredAsterisk
                                />
                                </div>
                                <div className='mt-4'>
                                <SelectInput 
                                name={`homes.${index}.bathrooms`} 
                                label={"Bathrooms"}
                                selected={values.homes[index].bathrooms}
                                options={bathroomsOptions}
                                requiredAsterisk
                                />
                                </div>
                                <div className='mt-4'>
                                <RadioInput 
                                name={`homes.${index}.furnished`} 
                                label={"Furnishing"}
                                selected={values.homes[index].furnished}
                                options={furnishedOptions}
                                requiredAsterisk
                                />
                                </div>
                                <div className='mt-4'>
                                <RadioInput
                                name={`homes.${index}.occupied`} 
                                label={"Occupancy"}
                                selected={values.homes[index].occupied}
                                options={occupiedOptions}
                                requiredAsterisk
                                />
                                </div>
                                <div className='mt-4'>
                                <RadioInput
                                name={`homes.${index}.managed`} 
                                label={"Management"}
                                selected={values.homes[index].managed}
                                options={managedOptions}
                                requiredAsterisk
                                />
                                </div>
                                <div className='mt-4'>
                                <TextInput 
                                name={`homes.${index}.availableFrom`} 
                                label={"Available from"}
                                type="date"
                                requiredAsterisk
                                />
                                </div>
                                </div>
                            </div>    
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
                </Tab.Group>
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

export default StepThree;