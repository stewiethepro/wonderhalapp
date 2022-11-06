import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const StepFour = (props) => {

const handleSubmit = (values) => {
    props.next(values, true);
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
        {props.auckland ?
        <>
        <p className="text-base text-gray-500">
        Next steps will be a quick call with the Hamlet team to go over your needs, how Hamlet works and any questions you may have.
        </p>
        <p className="text-base text-gray-500">
        Click book now to complete the application and open the booking page.
        </p>
        </>
        : 
        <p className="text-base text-gray-500">
        We won't be able to manage your homes at the moment, but click finish below and we'll get in touch when we expand to your region.
        </p>  
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
            <button
            type={"submit"}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            {props.auckland ? 
            "Book now"
            :
            "Finish"
            }
            </button>
        </div>
        </Form>
    )}
    </Formik>

    </>
)
}

export default StepFour;