import { Formik, Form, useFormikContext } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import "yup-phone";
import PhoneInput from '@/components/forms/inputs/PhoneInput';
import { isPossiblePhoneNumber } from 'react-phone-number-input'

function validatePhoneNumber(value){
    if (typeof value === "undefined") {
        value = ""
    }
    return isPossiblePhoneNumber(value)
}

const yupValidationSchema = Yup.object().shape({
    phone: Yup
    .string()
    .required("A phone number is required")
    .test(
        'is-possible-phone-number',
        'Please enter a valid phone number',
        (value) => 
        validatePhoneNumber(value),
    )
});

const StepThree = (props) => {

const handleSubmit = (values) => {
    props.next(values, true);
};

return (
    <>
    <Formik
    validationSchema={yupValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit} 
    >  
    {({values, setFieldValue}) => (
        <Form>
        <div className='my-16'>
            <div className='my-10'>
            <PhoneInput
            name="phone"
            label="Phone Number"
            setFieldValue={setFieldValue}
            number={props.data.phone}
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
            Submit
            </button>
        </div>
        </Form>
    )}
    </Formik>
    </>
)
}

export default StepThree;