import { Formik, Form, useFormikContext } from "formik"
import { Persist } from 'formik-persist'
import * as Yup from "yup";
import RadioInput from "@/components/forms/inputs/RadioInput";

const stepOneOptions = [
    { id: 1, value: 'Resident', title: 'Resident', description: 'I am looking to rent a home' },
    { id: 2, value: 'Homeowner', title: 'Homeowner', description: 'I am looking to let my home' },
  ];

const stepOneValidationSchema = Yup.object({
userType: Yup
.string()
.required()
});

const StepOne = (props) => {
const handleSubmit = (values) => {
    props.next(values);
};

return (
    <Formik
    validationSchema={stepOneValidationSchema}
    initialValues={props.data}
    onSubmit={handleSubmit}
    
    > 
    {({values}) => (
        <Form>
        <div className='my-20'>
            <RadioInput 
            name={"userType"}
            selected={props.data.userType}
            options={stepOneOptions}
            />
        </div>
        <div className='mt-8 flex justify-center'>
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
    );
};

export default StepOne;