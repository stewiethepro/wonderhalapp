import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import Link from "next/link"

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const StepTwo = (props) => {

const {applicantData} = props
const {resident} = applicantData

const handleSubmit = (values) => {
    props.next(values);
};

return (
    <>

    <Formik
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    
    {({values, errors, touched}) => (
        <Form>
        
        <div className="flex-1 space-y-2 flex flex-col">
        {resident.isApproved ?
        <>
          {resident.inBudget ? 
          <>
            <p className="text-base text-gray-500">
            Congrats, you’re pre-approved and meet the budget criteria for this home 🎉 🥳
            </p>
            <p className="text-base text-gray-500">
            Click the button below to choose your ideal start date and submit your application.
            </p>
          </>
          : 
          <>
            <p className="text-base text-gray-500">
            Sorry, but you do not meet the budget criteria for this home.
            </p>
            <p className="text-base text-gray-500">
            You can read more about our budget requirements here.
            </p>
            <p className="text-base text-gray-500">
            Feel free to get in touch with us if you have any questions.
            </p>
          </>
          }  
        </>
        : 
        <>
          <p className="text-base text-gray-500">
          To apply for Hamlet homes, you first need to apply to become a Hamlet resident. Once approved, you can apply for any Hamlet Home in two clicks.
          </p>
          <p className="text-base text-gray-500">
          Click the button below to start your application, it only takes a couple of minutes and you'll get an answer straight away.
          </p>
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

            {resident.isApproved ?
            <>
              {resident.inBudget ? 
              <>
                <button
                type={"submit"}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Next
                </button>
              </>
              : 
              <>
                <Link href="/homes">
                  <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                  See more homes
                  </button>
                </Link>
              </>
              }  
            </>
            : 
            <>
              <Link href="/resident/apply/start">
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                  Become a resident
                </button>
              </Link>
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