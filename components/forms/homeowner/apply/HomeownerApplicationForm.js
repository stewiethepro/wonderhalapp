import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import Submitting from '@/components/forms/utility/Submitting'
import SoloStepOne from '@/components/forms/homeowner/apply/steps/solo/StepOne'
import SoloStepTwo from '@/components/forms/homeowner/apply/steps/solo/StepTwo'
import SoloStepThree from '@/components/forms/homeowner/apply/steps/solo/StepThree'
import SoloStepFour from '@/components/forms/homeowner/apply/steps/solo/StepFour'
import InvestorStepOne from '@/components/forms/homeowner/apply/steps/investor/StepOne'
import InvestorStepTwo from '@/components/forms/homeowner/apply/steps/investor/StepTwo'
import InvestorStepThree from '@/components/forms/homeowner/apply/steps/investor/StepThree'
import DashboardHeader from '@/components/header/DashboardHeader'
import { trackFormSubmitted } from '@/utils/segment/track'

  const data = {
    homeownerType: "",
    homes: [{
      address: {
        streetAddress: "",
        apartmentNumber: "",
        city: "",
        region: "",
        country: "",
        postcode: "",
      },
      homeType: "",
      bedrooms: "",
      bathrooms: "",
      furnished: "",
      occupied: "",
      managed: "",
      availableFrom: "",
    }],
    locations: [],
  }

  export default function HomeownerApplicationForm({ user, profileData }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter();
  
  if (user) {
    const userId = user.id
    const userEmail = user.email
  }

  const [data, setData] = useState({
    homeownerType: "",
    homes: [{
      address: {
        streetAddress: "",
        apartmentNumber: "",
        city: "",
        region: "",
        country: "",
        postcode: "",
      },
      homeType: "",
      bedrooms: "",
      bathrooms: "",
      furnished: "",
      occupied: "",
      managed: "",
      availableFrom: "",
    }],
    locations: [],
  });

  const soloRegions = []
  
  const checkSoloRegions = () => {
    data.homes.map((home) => (!soloRegions.includes(home.address.region)) && soloRegions.push(home.address.region))
    const auckland = soloRegions.includes("Auckland")
    const otherRegions = soloRegions.filter(region => region !== "Auckland")
    return {auckland, otherRegions}
  }
  
  const checkInvestorRegions = () => {
    const investorRegions = data.locations
    const auckland = investorRegions.includes("Auckland")
    const otherRegions = investorRegions.filter(region => region !== "Auckland")
    return {auckland, otherRegions}
  }

  const [currentStep, setCurrentStep] = useState(0);
  
  console.log(data);

  function prepareHomesPayloads(formData, homeownerApplicationId, homeownerNotInRegionId) {

    let homes = []

    if (homeownerApplicationId) {
        homes = formData.homes.map((home) => (
            {
               home_type: home.homeType,
               bedrooms: home.bedrooms,
               bathrooms: home.bathrooms,
               furnished: home.furnished,
               occupied: home.occupied,
               managed: home.managed,
               available_from: home.availableFrom,
               street_address: home.address.streetAddress,
               apartment_number: home.address.apartment_number,
               city: home.address.city,
               region: home.address.region,
               country: home.address.country,
               postcode: home.address.postcode,
               homeowner_application: homeownerApplicationId,
             } 
        ))
    } else {
        homes = formData.homes.map((home) => (
            {
               home_type: home.homeType,
               bedrooms: home.bedrooms,
               bathrooms: home.bathrooms,
               furnished: home.furnished,
               occupied: home.occupied,
               managed: home.managed,
               available_from: home.availableFrom,
               street_address: home.address.streetAddress,
               apartment_number: home.address.apartment_number,
               city: home.address.city,
               region: home.address.region,
               country: home.address.country,
               postcode: home.address.postcode,
               homeowner_not_in_region: homeownerNotInRegionId,
             } 
        ));
    }

    return homes
    
}

async function createHomeownerNotInRegion(locations) {
    return new Promise(resolve => {
      (async () => {
        try {
            const { data, error } = await supabase
          .from("homeowners_not_in_region")
          .insert([
            { 
            locations: locations,
            }
          ])

            if (error) {
              console.log("Supabase error:", error)
              resolve("Supabase error:", error)
            } else {
              console.log("homeowners_not_in_region: ", data);
              resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function createHomeownerApplication(locations) {
    return new Promise(resolve => {
      (async () => {
        try {
            const { data, error } = await supabase
          .from("homeowner_applications")
          .insert([
            { 
            locations: locations,
            }
          ])

            if (error) {
              console.log("Supabase error:", error)
              resolve("Supabase error:", error)
            } else {
              console.log("homeowner_applications: ", data);
              resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function createHomes(homesPayload) {
    return new Promise(resolve => {
      (async () => {
        try {
            const { data, error } = await supabase
            .from("homes")
            .insert(
              homesPayload
            )

            if (error) {
              console.log("Supabase error:", error)
              resolve("Supabase error:", error)
            } else {
              console.log("homes: ", data);
              resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function updateProfile(profilePayload, userId) {
  return new Promise(resolve => {
    (async () => {
      try {
          const { data, error } = await supabase
          .from("profiles")
          .update(profilePayload)
          .eq('id', userId)
          
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
  
async function makeRequest(formData, userId) {

  return new Promise(resolve => {

      (async () => {

          const profilePayload = {
            status: formData.homeownerType
          }

          let qualified = true

          if (formData.homeownerType !== "solo") {
  
              // Check if in auckland
              let auckland = checkInvestorRegions().auckland
              
              if (!auckland) {
        
                  try {
                      const result1 = await createHomeownerNotInRegion(formData.locations);
                      console.log("result1: ", result1);
                  } catch (error) {
                      console.log("error: ", error);
                      resolve(error)
                  }

                  qualified = false
          
              } else {

                  try {
                      const result1 = await createHomeownerApplication(formData.locations);
                      console.log("result1: ", result1);
                  } catch (error) {
                      console.log("error: ", error);
                      resolve(error)
                  }
          
              }
          } else {
          
              // Check if in auckland
              let {auckland, otherRegions} = checkSoloRegions()
              
              // If not in auckland post to homeowners_not_in_region
              if (!auckland) {

              let homeownerNotInRegionId = null
              
              try {
                  const result1 = await createHomeownerNotInRegion(otherRegions);
                  console.log("result1: ", result1);
                  homeownerNotInRegionId = result1[0].id
              } catch (error) {
                  console.log("error: ", error);
                  resolve(error)
              }

              const homes = prepareHomesPayloads(formData, null, homeownerNotInRegionId);

              console.log(homes);

              try {
                  const result2 = await createHomes(homes);
                  console.log("result2: ", result2);
              } catch (error) {
                  console.log("error: ", error);
                  resolve(error)
              }

              qualified = false
              
              } else {

              let locations = ["Auckland"]
              otherRegions.map((region) => {
                locations.push(region)
              })

              let homeownerApplicationId = null
              
              try {
                  const result1 = await createHomeownerApplication(locations);
                  console.log("result1: ", result1);
                  homeownerApplicationId = result1[0].id
              } catch (error) {
                  console.log("error: ", error);
                  resolve(error)
              }

              const homes = prepareHomesPayloads(formData, homeownerApplicationId, null);

              console.log(homes);

              try {
                  const result2 = await createHomes(homes);
                  console.log("result2: ", result2);
              } catch (error) {
                  console.log("error: ", error);
                  resolve(error)
              }
          
              }
          }

          try {
            const result3 = await updateProfile(profilePayload, userId);
            console.log("result3: ", result3);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          if (qualified) {
              resolve("success - qualified")
          } else {
              resolve("success - not qualified")
          }

      })();

  });

}

async function handleFormSubmit(formData, userId, userEmail, profileData) {

    return new Promise(resolve => {
      (async () => {
        try {
          console.log("submitting: ", submitting);
          const result = await makeRequest(formData, userId);

          setSubmitted(true)
          setSubmitting(false)

          // Define Segment Event Payload
          const eventUserId = userId
          const eventEmail = userEmail
          const eventProperties = {
            name: profileData.first_name + " " + profileData.last_name,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            user_type: profileData.user_type
          }

          if (result === "success - qualified") {
            console.log(result);
            console.log("nice, the function worked all the way through");

            const eventTitle = "Homeowner Form Submitted"
            // Track Segment Event - Homeowner Form Submitted
            trackFormSubmitted(eventTitle, eventUserId, eventEmail, eventProperties)

            router.push('/homeowner/apply/book')    

          } else if (result === "success - not qualified") {
            console.log(result);
            console.log("nice, the function worked all the way through");

            const eventTitle = "Homeowner Form Not In Region Submitted"
            // Track Segment Event - Homeowner Form Not In Region Submitted
            trackFormSubmitted(eventTitle, eventUserId, eventEmail, eventProperties)

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
    handleFormSubmit(newData, user.id, user.email, profileData);
  }

  setCurrentStep((prev) => prev + 1)
}

const handlePrevStep = (newData) => {
  setData((prev) => ({...prev, ...newData}));
  setCurrentStep((prev) => prev - 1)
}

const stepsSolo = [
  <SoloStepOne next={handleNextStep} data={data}/>, 
  <SoloStepTwo next={handleNextStep} prev={handlePrevStep} data={data}/>,
  <SoloStepThree next={handleNextStep} prev={handlePrevStep} data={data}/>,
  <SoloStepFour next={handleNextStep} prev={handlePrevStep} data={data} auckland={checkSoloRegions().auckland}/>,
]
const stepsInvestor = [
  <InvestorStepOne next={handleNextStep} data={data}/>, 
  <InvestorStepTwo next={handleNextStep} prev={handlePrevStep} data={data}/>,
  <InvestorStepThree next={handleNextStep} prev={handlePrevStep} data={data} auckland={checkInvestorRegions().auckland} submitting={submitting}/>,
]

const soloHeaderContent = [
  {
    title: "Step 1 of 4", 
    main: "Your homes",
    description: "How many homes are you looking to let?",
  },
  {
    title: "Step 2 of 4", 
    main: "Your homes",
    description: "Where are your homes?",
  },
  {
    title: "Step 3 of 4", 
    main: "Your homes",
    description: "Tell us more about your homes",
  },
  {
    title: "Step 4 of 4", 
    main: "Hamlet operates in Auckland",
    description: (typeof data.homes === "undefined" ? null : (checkSoloRegions().auckland ? (checkSoloRegions().otherRegions.length > 0 ? "We serve Auckland but sadly we aren't in " + checkSoloRegions().otherRegions.map((region) => region).join(', ').replace(/,(?!.*,)/gmi, ' or ') + " yet."  : "Good news, we cover all of Auckland!") : "Sorry, we don't serve " + checkSoloRegions().otherRegions.map((region) => region).join(', ').replace(/,(?!.*,)/gmi, ' or ') + " yet.")), 
  },
]

const investorHeaderContent = [
  {
    title: "Step 1 of 3", 
    main: "Your homes",
    description: "How many homes are you looking to let?",
  },
  {
    title: "Step 2 of 3", 
    main: "Your homes",
    description: "Where are your homes?",
  },
  {
    title: "Step 3 of 3",
    main: "Hamlet operates in Auckland",
    description: (typeof data.locations === "undefined" ? null : (checkInvestorRegions().auckland ? (checkInvestorRegions().otherRegions.length > 0 ? "We serve Auckland but sadly we aren't in " + checkInvestorRegions().otherRegions.map((region) => region).join(', ').replace(/,(?!.*,)/gmi, ' or ') + " yet."  : "Good news, we cover all of Auckland!") : "Sorry, we don't serve " + checkInvestorRegions().otherRegions.map((region) => region).join(', ').replace(/,(?!.*,)/gmi, ' or ') + " yet.")), 
  },
]

const primaryCard = [
  {
    id: "step-one-image",
    imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/house/pexels-jeffrey-czum-3330118.jpg?t=2022-08-03T00%3A46%3A40.245Z',
    imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
    color: 'indigo-500',
  },
  {
    id: "step-two-image",
    imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/people/pexels-jack-krzysik-6611628.jpg',
    imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
    color: 'teal-500',
  },
  {
    id: "step-three-image",
    imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/house/pexels-jeffrey-czum-3330118.jpg?t=2022-08-03T00%3A46%3A40.245Z',
    imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
    color: 'indigo-500',
  },
  {
    id: "step-four-image",
    imageSrc: 'https://cijtrwqqphdofjmlvaee.supabase.co/storage/v1/object/public/public/people/pexels-jack-krzysik-6611628.jpg',
    imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
    color: 'teal-500',
  },
]
  
      return (
        <>
            {/* <SuccessModal submitted={submitted} data={data}/> */}

            {submitting && 
                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                        <Submitting/>
                    </div>
                </div>
            }
            {!(submitted || submitting) &&
                    <div>
                      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:gap-8">
                        <div>
                          {((data.homeownerType === 'solo') || (data.homeownerType === '')) ? 
                          <>
                          <DashboardHeader headerContent={soloHeaderContent[currentStep]} />
                          </>
                          :
                          <> 
                          <DashboardHeader headerContent={investorHeaderContent[currentStep]} />
                          </>
                          }
                          <div className="w-full lg:max-w-lg">
                              <div className='form-wrapper'>
                              {((data.homeownerType === 'solo') || (data.homeownerType === '')) ? 
                              <>
                              {stepsSolo[currentStep]} 
                              </>
                              :
                              <> 
                              {stepsInvestor[currentStep]}
                              </>
                              }
                              </div>
                          </div>
                        </div>
                        <div className="group aspect-w-2 aspect-h-1 shadow-2xl rounded-lg overflow-hidden sm:aspect-h-1 sm:aspect-w-1">
                          <img
                            src={primaryCard[currentStep].imageSrc}
                            alt={primaryCard[currentStep].imageAlt}
                            className="object-center object-cover"
                          />
                          <div aria-hidden="true" className={`bg-gradient-to-b from-transparent to-${primaryCard[currentStep].color} opacity-20`}/>
                        </div>
                      </div>
                    </div>
            }
        </>
      )
    }