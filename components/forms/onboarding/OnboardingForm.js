import { useState } from 'react'
import { Router, useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import Submitting from '@/components/forms/utility/Submitting'
import SuccessModal from '@/components/forms/utility/SuccessModal'
import StepOne from '@/components/forms/onboarding/steps/StepOne'
import StepTwo from '@/components/forms/onboarding/steps/StepTwo'
import StepThree from '@/components/forms/onboarding/steps/StepThree'
import { post } from '@/utils/api/request'

  const data = {
    userType: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    residentGroupId: "",
    residentGroupMemberIdId: "",
  }
  
  export default function OnboardingForm({ user }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const { query } = router
  let {resident_group_id, resident_group_members_id} = query
  resident_group_id = resident_group_id ?? "" 
  resident_group_members_id = resident_group_members_id ?? "" 

  if (user) {
    const userId = user.id
    const userEmail = user.email
  }

  const [data, setData] = useState({
    userType: "",
    firstName: "",
    lastName: "",
    phone: "",
    residentGroupId: resident_group_id,
    residentGroupMemberId: resident_group_members_id,
  });
  
  const [currentStep, setCurrentStep] = useState(0);

  console.log(data);
  
  async function updateProfile(profilePayload, userId) {
    return new Promise(resolve => {
      (async () => {
        try {
            const { data, error } = await supabase
            .from("profiles")
            .update(profilePayload)
            .eq('id', userId)
            .select()
            
            if (error) {
                console.log("Supabase error:", error)
                resolve("Supabase error:", error)
            } else {
                console.log("profile: ", data);
                resolve(data)
            }
  
        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function updateResidentGroupMember(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/supabase/resident-group-members/update', request).then((result) => {
                const data = result
                console.log("API result: ", data);
                resolve(data)
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function makeRequest(formData, userId, userEmail) {

    return new Promise(resolve => {
  
        (async () => {
  
            let profilePayload = {
                user_type: formData.userType,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                is_onboarding: false,
                resident_group: false,
            }

            if ((formData.residentGroupId !== "") || (formData.residentGroupMemberId !== "")) {
                console.log("found a resident group id or a resident group member");
          
                profilePayload.resident_group = true

                const updateResidentGroupMemberPayload = {
                    resident_group_id: formData.residentGroupId,
                    resident_group_members_id: formData.residentGroupMemberId,
                    user_id: userId,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: userEmail,
                    status: "onboarded"
                }
          
                try {
                    const result1 = await updateProfile(profilePayload, userId);
                    console.log("result1: ", result1);
                } catch (error) {
                    console.log("error: ", error);
                    resolve(error)
                }
          
                try {
                    const result2 = await updateResidentGroupMember(updateResidentGroupMemberPayload);
                    console.log("result2: ", result2);
                } catch (error) {
                    console.log("error: ", error);
                    resolve(error)
                }
          
            } else {

                try {
                    const result1 = await updateProfile(profilePayload, userId);
                    console.log("result1: ", result1);
                } catch (error) {
                    console.log("error: ", error);
                    resolve(error)
                }

            }
            
            resolve("success - " + formData.userType)
        
        })();
  
    });
  
}

async function handleFormSubmit(formData, userId, userEmail) {

    return new Promise(resolve => {
      (async () => {
        try {
          console.log("submitting: ", submitting);
          const result = await makeRequest(formData, userId, userEmail);

          setSubmitted(true)
          setSubmitting(false)

          if (result === "success - Resident") {
            console.log(result);
            console.log("nice, the function worked all the way through");

            router.push('/resident/dashboard')    

          } else if (result === "success - Homeowner") {
            console.log(result);
            console.log("nice, the function worked all the way through");

            router.push('/homeowner/dashboard')

          } else {
            console.log(result);
            console.log("too bad, the function failed along the way");
          }

          resolve("form submitted")

        } catch (error) {
            console.log("error: ", error);
            resolve(error)
        }
      })();
    })
}
  
  const handleNextStep = (newData, final = false) => {
    setData((prev) => ({...prev, ...newData}));
  
    if (final) {
      setSubmitting(true);
      handleFormSubmit(newData, user.id, user.email)
    }
  
    setCurrentStep((prev) => prev + 1)
  }
  
  const handlePrevStep = (newData) => {
    setData((prev) => ({...prev, ...newData}));
    setCurrentStep((prev) => prev - 1)
  }
  
  const steps = [
    <StepOne next={handleNextStep} data={data}/>, 
    <StepTwo next={handleNextStep} prev={handlePrevStep} data={data}/>,
    <StepThree next={handleNextStep} prev={handlePrevStep} data={data} submitting={submitting}/>
  ]
  
  const stepsQuestions = [
    "Resident or homeowner?",
    "What's your name?",
    "What's your phone number?",
  ]
  
  const stepperSteps = [  
    "Step 1 of 3",
    "Step 2 of 3",
    "Step 3 of 3",
  ]
  
      return (
        <>
            {submitting && 
                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                        <Submitting/>
                    </div>
                </div>
            }
            {!(submitted || submitting) &&
                <div className="flex-1 flex flex-col justify-center py-2 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-8">
                            <span className="inline-flex items-center px-2.5 py-2.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
                                {stepperSteps[currentStep]}
                            </span>
                            </div>
                            <p className="mt-1 text-4xl font-extrabold text-indigo-600 sm:text-5xl sm:tracking-tight lg:text-6xl">
                            {stepsQuestions[currentStep]}
                            </p>
                        </div>
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <div className='form-wrapper'>
                            {steps[currentStep]}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
      )
    }