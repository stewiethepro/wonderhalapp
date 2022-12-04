import { useState } from 'react'
import { Router, useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import Submitting from '@/components/forms/utility/Submitting'
import SuccessModal from '@/components/forms/utility/SuccessModal'
import StepOne from '@/components/forms/openai/steps/StepOne'
import StepTwo from '@/components/forms/openai/steps/StepTwo'
import { post } from '@/utils/api/request'

  const data = {
    prompt: ""
  }
  
  export default function OpenAiForm({ user }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const [aiResponse, setAiResponse] = useState("")

  if (user) {
    const userId = user.id
    const userEmail = user.email
  }

  const [data, setData] = useState({
    prompt: "",
  });
  
  const [currentStep, setCurrentStep] = useState(0);

  console.log(data);
  
  async function askOpenAi(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/openai/completion/post', request).then((result) => {
                const data = result;
                console.log("API result: ", data);
                resolve(data);
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error);
        }
      })()
    })
  }

async function makeRequest(formData) {

    return new Promise(resolve => {
  
        (async () => {
          
                try {
                    const result1 = await askOpenAi(formData);
                    console.log("result1: ", result1);
                    setAiResponse(result1.choices[0].text)
                } catch (error) {
                    console.log("error: ", error);
                    resolve(error)
                }
            
            resolve("success")
        
        })();
  
    });
  
}

async function handleFormSubmit(formData) {

    return new Promise(resolve => {
      (async () => {
        try {
          console.log("submitting: ", submitting);
          const result = await makeRequest(formData);

          setSubmitted(true)
          setSubmitting(false)

          if (result === "success") {
            console.log(result);
          } else {
            console.log(result);
            console.log("too bad, the function failed");
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
    <StepOne next={handleNextStep} prev={handlePrevStep} data={data} submitting={submitting}/>,
    <StepTwo next={handleNextStep} prev={handlePrevStep} data={data} submitting={submitting}/>
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
            {!submitting && submitted && 
              <> 
                <div className="flex-1 flex flex-col justify-center py-2 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <div className='form-wrapper'>
                              <h1>{aiResponse}</h1>
                            </div>
                        </div>
                    </div>
                </div>
              </>
            }
                <div className="flex-1 flex flex-col justify-center py-2 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <div className='form-wrapper'>
                            {steps[currentStep]}
                            </div>
                        </div>
                    </div>
                </div>
        </>
      )
    }