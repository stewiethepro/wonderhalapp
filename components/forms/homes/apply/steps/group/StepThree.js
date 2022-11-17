import { Formik, Form, FieldArray, useFormik } from "formik"
import { Persist } from 'formik-persist'
import Link from "next/link"

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const StepThree = (props) => {

const {applicantData} = props
const {resident, groups} = applicantData
const filteredGroup = groups.filter(group => group.groupId === props.data.residentGroupId)
const selectedGroup = filteredGroup[0]
const {flatmates} = selectedGroup
const filteredFlatmates = flatmates.filter(flatmate => flatmate.userId !== resident.userId)

const flatmatesNotApproved = []

filteredFlatmates.map((flatmate) => {
    !flatmate.isApproved && flatmatesNotApproved.push(flatmate.firstName)
})

const flatmatesNotApprovedNames = flatmatesNotApproved.join(', ').replace(/,(?!.*,)/gmi, ' and ')
console.log("flatmatesNotApproved: ", flatmatesNotApprovedNames);

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
        {selectedGroup.isApproved ?
        <>
            {selectedGroup.inBudget ? 
            <>
            <p className="text-base text-gray-500">
            Congrats, your group is pre-approved and meets the budget criteria for this home 🎉 🥳
            </p>
            <p className="text-base text-gray-500">
            Click the button below to choose your ideal start date and submit your application.
            </p>
            </>
            : 
            <>
            <p className="text-base text-gray-500">
            Sorry, but your group does not meet the budget criteria for this home.
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
            {resident.isApproved ? 
            <>
                <p className="text-base text-gray-500">
                Looks like {flatmatesNotApprovedNames + (flatmatesNotApproved.length > 1 ? " have " : " has ")} not completed their Hamlet Resident application.
                </p>
                <p className="text-base text-gray-500">
                To apply for Hamlet homes, each member of your group needs to apply to become a Hamlet resident. Once approved, your group can apply for any Hamlet Home in three clicks.
                </p>
                <p className="text-base text-gray-500">
                Click the button below to view your group's status.
                </p>
            </>
            : 
            <>
                {flatmatesNotApproved.length > 0 ? 
                <>
                    {flatmatesNotApproved.length > 1 ? 
                        <p className="text-base text-gray-500">
                        Looks like you, {flatmatesNotApprovedNames} have not completed your Hamlet Resident application.
                        </p> 
                        : 
                        <p className="text-base text-gray-500">
                        Looks like you and {flatmatesNotApprovedNames} have not completed your Hamlet Resident application.
                        </p>
                    } 
                    <p className="text-base text-gray-500">
                    To apply for Hamlet homes, each member of your group needs to apply to become a Hamlet resident. Once approved, your group can apply for any Hamlet Home in three clicks.
                    </p>
                    <p className="text-base text-gray-500">
                    Click the button below to start your application, it only takes a couple of minutes and you'll get an answer straight away. And don't forget to follow up with {flatmatesNotApprovedNames}!
                    </p>
                </>
                : 
                <>
                    <p className="text-base text-gray-500">
                    Looks like you're the last one in your group who has not completed their Hamlet Resident application.
                    </p>
                    <p className="text-base text-gray-500">
                    To apply for Hamlet homes, each member of your group needs to apply to become a Hamlet resident. Once approved, your group can apply for any Hamlet Home in three clicks.
                    </p>
                    <p className="text-base text-gray-500">
                    Click the button below to start your application, it only takes a couple of minutes and you'll get an answer straight away.
                    </p>
                </>
                }
            </>
            }  
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

            {selectedGroup.isApproved ?
            <>
                {selectedGroup.inBudget ? 
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
                {resident.isApproved ? 
                <>
                    <Link href="/resident/flatmates">
                        <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        View group status
                        </button>
                    </Link>
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
            </>
            } 
        </div>
        </Form>
    )}
    </Formik>

    </>
)
}

export default StepThree;