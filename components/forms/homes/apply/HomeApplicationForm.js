import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import Submitting from '@/components/forms/utility/Submitting'
import SoloStepOne from '@/components/forms/homes/apply/steps/solo/StepOne'
import SoloStepTwo from '@/components/forms/homes/apply/steps/solo/StepTwo'
import SoloStepThree from '@/components/forms/homes/apply/steps/solo/StepThree'
import GroupStepOne from '@/components/forms/homes/apply/steps/group/StepOne'
import GroupStepTwo from '@/components/forms/homes/apply/steps/group/StepTwo'
import GroupStepThree from '@/components/forms/homes/apply/steps/group/StepThree'
import GroupStepFour from '@/components/forms/homes/apply/steps/group/StepFour'
import DashboardHeader from '@/components/header/DashboardHeader'
import { trackHomeApplicationFormSubmitted, trackHomeApplicationSubmittedResidentNotified } from '@/utils/segment/track'
import { 
    DocumentTextIcon,
    HomeModernIcon,
    UserCircleIcon,
} from '@heroicons/react/20/solid'

  const data = {
    group: false,
    residentGroupId: "",
    startDate: "",
    home: {
        id: "",
        availableFrom: "",
        homeownerId: "",
    },
    resident: {
        userId: "", 
        email: "", 
        firstName: "", 
        budget: 0, 
        status: "", 
        pets: false, 
        inBudget: false, 
        isApproved: false,
    },
    selectedGroup: {},
  }

  export default function HomeApplicationForm({ home, homeApplications, user, profileData, residentGroups, flatmates, hasApplied }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter();
  
  if (user) {
    const userId = user.id
    const userEmail = user.email
  }
  let applicationId = ""
  const applicationsForThisHouse = homeApplications.filter(homeApplication => homeApplication.home_id === home.id)
  applicationsForThisHouse.length > 0 ? applicationId = applicationsForThisHouse[0].id : ""

  console.log("applicationsForThisHouse: ", applicationsForThisHouse);
  console.log("applicationId: ", applicationId);

  console.log("profile: ", profileData);
  console.log("residentGroups: ", residentGroups);
  console.log("home: ", home);

  const residentUserId = profileData.id
  const residentEmail = profileData.email
  const residentFirstName = profileData.first_name
  const residentBudget = profileData.budget
  const residentStatus = profileData.status
  const residentPets = profileData.pets
  

  const inBudget = residentBudget >= (home.price * .85)
  const isApproved = residentStatus === "pre-approved" || residentStatus === "approved"

  const applicantData = {
    resident: {
        userId: residentUserId, 
        email: residentEmail, 
        firstName: residentFirstName, 
        budget: residentBudget, 
        status: residentStatus, 
        pets: residentPets, 
        inBudget: inBudget, 
        isApproved: isApproved,
    },
    groups: []
  }

  residentGroups.map((group) => {

    const groupId = group.id
    const groupBudget = group.budget
    const groupStatus = group.status
    const groupPets = group.pets
    const inBudget = groupBudget >= (home.price * .85)
    const isApproved = groupStatus === "pre-approved" || groupStatus === "approved"

    let groupData = {
      groupId: groupId,
      budget: groupBudget, 
      status: groupStatus, 
      pets: groupPets,
      inBudget: inBudget,
      isApproved: isApproved,
      flatmates: []
    }

    flatmates.map((flatmate) => {
        flatmate.resident_group_id === groupId && groupData.flatmates.push({
            userId: flatmate.user_id,
            email: flatmate.email,
            firstName: flatmate.first_name,
            status: flatmate.status, 
            isApproved: flatmate.status === "pre-approved" || flatmate.status === "approved",
        })
    })

    applicantData.groups.push(groupData)

  })

  console.log("applicantData: ", applicantData);

  console.log("flatmates: ", flatmates);

  const [data, setData] = useState({
    group: false,
    residentGroupId: "",
    startDate: home.available_from,
    home: {
        id: home.id,
        availableFrom: home.available_from,
        description: home.description,
        image: home.homes_images[0].src,
        homeownerId: home.user_id,
        href: home.href,
        price: home.price,
        propertyType: home.property_type, 
        address: {
            streetAddress: home.street_address
        },
        summary: home.summary,
        title: home.title,
        trademeUrl: home.trademe_url,
    },
    resident: {
        userId: residentUserId, 
        email: residentEmail, 
        firstName: residentFirstName, 
        budget: residentBudget, 
        status: residentStatus, 
        pets: residentPets, 
        inBudget: inBudget, 
        isApproved: isApproved,
    },
    selectedGroup: {},
  });

  let selectedGroup = {
    groupId: "",
    budget: 0, 
    status: "", 
    pets: false, 
    inBudget: false,
    isApproved: false,
    flatmates: []
  }

  if (data.residentGroupId !== "" && data.group) {
    const filteredGroup = applicantData.groups.filter(group => group.groupId === data.residentGroupId)
    selectedGroup = filteredGroup[0]
    data.selectedGroup = selectedGroup
  } else {
    data.selectedGroup = {}
  }

  const [currentStep, setCurrentStep] = useState(0);
  
  console.log("data: ", data);

  function preparePayloads(formData) {

    let homeApplicationPayload = {}

    if (formData.group) {

        let groupApplicationPayload = {
            resident_id: formData.resident.userId,
            resident_group_id: formData.residentGroupId,
            homeowner_id: formData.home.homeownerId,
            home_id: formData.home.id,
            start_date: formData.startDate,
        }

        homeApplicationPayload = groupApplicationPayload

    } else {

        let soloApplicationPayload = {
            resident_id: formData.resident.userId,
            homeowner_id: formData.home.homeownerId,
            home_id: formData.home.id,
            start_date: formData.startDate,
        }

        homeApplicationPayload = soloApplicationPayload

    }
  
    return {
        homeApplicationPayload: homeApplicationPayload,
    }
}

async function createHomeApplication(homeApplicationPayload) {
    return new Promise(resolve => {
      (async () => {
        try {

            // Insert row to home applications
            const { data, error } = await supabase
            .from("home_applications")
            .insert([
                homeApplicationPayload
            ])
            .select()
            
            if (error) {
                console.log("Supabase error:", error)
                resolve("Supabase error:", error)
            } else {
                console.log("home_application: ", data);
                resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function sendNotifications(formData, applicationReference) {
    return new Promise(resolve => {
      (async () => {
        try {

            if (formData.group) {
                // Trigger Segment track event for each resident in the group
    
                formData.selectedGroup.flatmates.map((flatmate) => {
                
                const eventTitle = "Resident Group Home Application Submitted"
                const eventUserId = flatmate.userId
                const eventProperties = {
                    applicant: {
                        first_name: flatmate.firstName,
                        email: flatmate.email,
                        userId: flatmate.userId,
                        resident_group_id: formData.residentGroupId,
                    },
                    application: {
                        reference: applicationReference,
                        href: formData.home.href + "/apply/" + applicationReference,
                        lead_applicant: formData.resident.firstName,
                        start_date: formData.startDate,
                    },
                    home: {
                        available_from: formData.home.availableFrom,
                        description: formData.home.description,
                        image: formData.home.image,
                        href: formData.home.href,
                        id: formData.home.id,
                        price: formData.home.price,
                        property_type: formData.home.propertyType, 
                        street_address: formData.home.address.streetAddress,
                        summary: formData.home.summary,
                        title: formData.home.title,
                        trademe_url: formData.home.trademeUrl,
                    }
                }
                console.log("eventTitle: ", eventTitle);
                console.log("eventUserId: ", eventUserId);
                console.log("eventProperties: ", eventProperties);
                
                trackHomeApplicationSubmittedResidentNotified(eventTitle, eventUserId, eventProperties)
                
                })

            } else {
                // Trigger Segment track event for solo resident

                const eventTitle = "Solo Resident Home Application Submitted"
                const eventUserId = formData.resident.userId
                const eventProperties = {
                    applicant: {
                        first_name: formData.resident.firstName,
                        email: formData.resident.email,
                        userId: formData.resident.userId,
                    },
                    application: {
                        reference: applicationReference,
                        href: formData.home.href + "/apply/" + applicationReference,
                        lead_applicant: formData.resident.firstName,
                        start_date: formData.startDate,
                    },
                    home: {
                        available_from: formData.home.availableFrom,
                        description: formData.home.description,
                        image: formData.home.image,
                        href: formData.home.href,
                        id: formData.home.id,
                        price: formData.home.price,
                        property_type: formData.home.propertyType, 
                        street_address: formData.home.address.streetAddress,
                        summary: formData.home.summary,
                        title: formData.home.title,
                        trademe_url: formData.home.trademeUrl,
                    }
                }
                
                trackHomeApplicationSubmittedResidentNotified(eventTitle, eventUserId, eventProperties)

            }

            const eventTitle = "Home Application Form Submitted"
            const eventUserId = formData.resident.userId
            const eventProperties = {
                applicant: {
                    first_name: formData.resident.firstName,
                    email: formData.resident.email,
                    userId: formData.resident.userId,
                },
                application: {
                    reference: applicationReference,
                    href: formData.home.href + "/apply/" + applicationReference,
                    lead_applicant: formData.resident.firstName,
                    start_date: formData.startDate,
                    homeowner_id: formData.home.user_id,
                    group: formData.group,
                    resident_group_id: formData.residentGroupId,
                },
                home: {
                    available_from: formData.home.availableFrom,
                    description: formData.home.description,
                    href: formData.home.href,
                    id: formData.home.id,
                    price: formData.home.price,
                    property_type: formData.home.propertyType, 
                    street_address: formData.home.address.streetAddress,
                    summary: formData.home.summary,
                    title: formData.home.title,
                    trademe_url: formData.home.trademeUrl,
                }
            }

            // Track Segment Event - Home Application Form Submitted
            trackHomeApplicationFormSubmitted(eventTitle, eventUserId, eventProperties)

            resolve("segment track events triggered, notifications sent")

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}
  
async function makeRequest(formData) {
    return new Promise(resolve => {

        (async () => {
  
            const {
                homeApplicationPayload,
            } = preparePayloads(formData)
      
            console.log({
                homeApplicationPayload: homeApplicationPayload,
            });

            let applicationReference = ""

            try {
                const result1 = await createHomeApplication(homeApplicationPayload);
                console.log(result1);
                applicationReference = result1[0].id
            } catch (error) {
                console.log("error: ", error);
                resolve(error)
            }
    
            try {
                const result2 = await sendNotifications(formData, applicationReference);
                console.log("result2: ", result2);
            } catch (error) { 
                console.log("error: ", error);
                resolve(error)
            }

            resolve("success")
  
          })();
  
    })
}

async function handleFormSubmit(formData) {
    return new Promise(resolve => {
        (async () => {
          try {
            console.log("submitting: ", submitting);
            const result = await makeRequest(formData);
            if (result === "success") {
                console.log("nice, the function worked all the way through");
            } else {
                console.log("too bad, the function failed along the way");
            }
            setSubmitted(true)
            setSubmitting(false)
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
  <SoloStepOne next={handleNextStep} data={data} applicantData={applicantData}/>, 
  <SoloStepTwo next={handleNextStep} prev={handlePrevStep} data={data} applicantData={applicantData}/>,
  <SoloStepThree next={handleNextStep} prev={handlePrevStep} data={data} applicantData={applicantData}/>,
]
const stepsGroup = [
  <GroupStepOne next={handleNextStep} data={data} applicantData={applicantData}/>, 
  <GroupStepTwo next={handleNextStep} prev={handlePrevStep} data={data} applicantData={applicantData}/>,
  <GroupStepThree next={handleNextStep} prev={handlePrevStep} data={data} applicantData={applicantData}/>,
  <GroupStepFour next={handleNextStep} prev={handlePrevStep} data={data} applicantData={applicantData}/>,
]

const soloHeaderContent = [
  {
    title: "Step 1 of 3", 
    main: "Alone or flatting",
    description: "Choose how you want to apply for this home",
  },
  {
    title: "Step 2 of 3", 
    main: (applicantData.resident.isApproved ? (applicantData.resident.inBudget ? "You're good to go!" : "Not in budget") : "Not yet approved"),
    description: "",
  },
  {
    title: "Step 3 of 3", 
    main: "Preferred start date",
    description: "The default date is the date the property is available from.",
  },
]

const groupHeaderContent = [
  {
    title: "Step 1 of 4", 
    main: "Alone or flatting",
    description: "Choose how you want to apply for this home",
  },
  {
    title: (applicantData.groups.length < 1 ? "Step 2 of 2" : "Step 2 of 4"), 
    main: (applicantData.groups.length < 1 ? (applicantData.resident.isApproved ? "You're not in a group" : "Not yet approved") : "Your group"),
    description: (applicantData.groups.length < 1 ? "" : "Who are you applying with?"),
  },
  {
    title: (selectedGroup.isApproved ? (selectedGroup.inBudget ? "Step 3 of 4" : "Step 3 of 3") : "Step 3 of 3"), 
    main: (selectedGroup.isApproved ? (selectedGroup.inBudget ? "You're good to go!" : "Not in budget") : "Not yet approved"),
    description: "",
  },
  {
    title: "Step 4 of 4", 
    main: "Preferred start date",
    description: "The default date is the date the property is available from.",
  },
]

const primaryCard =
  {
    id: home.homes_images[0].id,
    imageSrc: home.homes_images[0].src,
    imageAlt: home.homes_images[0].alt,
    color: 'indigo-500',
  }
  
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
            {!(submitted || submitting || hasApplied) &&
                <div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:gap-8">
                    <div>
                        {data.group ? 
                        <>
                        <DashboardHeader headerContent={groupHeaderContent[currentStep]} />
                        </>
                        :
                        <> 
                        <DashboardHeader headerContent={soloHeaderContent[currentStep]} />
                        </>
                        }
                        <div className="w-full lg:max-w-lg">
                            <div className='form-wrapper'>
                            {data.group ?  
                            <>
                            {stepsGroup[currentStep]}
                            </>
                            :
                            <> 
                            {stepsSolo[currentStep]} 
                            </>
                            }
                            </div>
                        </div>
                    </div>
                    <div className="group aspect-w-2 aspect-h-1 shadow-2xl rounded-lg overflow-hidden sm:aspect-h-1 sm:aspect-w-1">
                        <img
                        src={primaryCard.imageSrc}
                        alt={primaryCard.imageAlt}
                        className="object-center object-cover"
                        />
                        <div aria-hidden="true" className={`bg-gradient-to-b from-transparent to-${primaryCard.color} opacity-20`}/>
                    </div>
                    </div>
                </div>
            }
            {((submitted && !submitting) || hasApplied) && 
            <>
                <div className="bg-slate-50">
                    <div aria-hidden="true" className="relative">
                    <img
                        src={data.home.image}
                        alt=""
                        className="h-96 w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50" />
                    </div>
            
                    <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Application submitted</h2>
                            <p className="mt-4 text-gray-500">
                            You should have received an email confirming the details of your application for 
                            <span className='font-bold'> {data.home.address.streetAddress}</span>
                            .
                            </p>
                        </div>

                        <div className='mt-8 grid justify-center grid-cols-1 sm:grid-cols-3'>
                            <div className="mt-3 sm:ml-2 inline-flex justify-center">
                                <Link href="/homes">
                                    <button
                                    type={"button"}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                    <HomeModernIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                                    View more homes
                                    </button>
                                </Link>
                            </div>
                            <div className="mt-3 sm:ml-2 inline-flex justify-center">
                                <Link href={"/homes/" + home.id + "/apply/" + applicationId.toString()}>
                                    <button
                                    type={"button"}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                    <DocumentTextIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
                                    View application
                                    </button>
                                </Link>
                            </div>
                            <div className="mt-3 sm:ml-2 inline-flex justify-center">
                                <Link href="/resident/dashboard">
                                    <button
                                    type={"button"}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                    <UserCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                                    Go to dashboard
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            }
        </>
      )
    }