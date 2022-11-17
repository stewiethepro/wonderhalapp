import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import Submitting from '@/components/forms/utility/Submitting'
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import ScaleLoader from "react-spinners/ScaleLoader";

// Steps
import StepOne from '@/components/forms/resident/add-flatmates/steps/StepOne'

import DashboardHeader from '@/components/header/DashboardHeader'

import { post } from '@/utils/api/request'
import { 
  trackFormSubmitted, 
  trackNewResidentInvited, 
  trackExistingResidentInvited } from '@/utils/segment/track'

import Loader from '../../utility/Loader'

  const data = {
    flatmates: [{
      firstName: "",
      lastName: "",
      email: "",
      userExists: false,
      userId: null,
      userStatus: null,
      budget: 0,
    }],
    residentGroupId: null,
  }

  export default function AddFlatmates({ open, onClose, user, profileData, residentGroupId }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const router = useRouter()

  console.log("residentGroupId: ", residentGroupId);

  if (user) {
    const userId = user.id
    const userEmail = user.email
  }

  const [data, setData] = useState({
    flatmates: [{
      firstName: "",
      lastName: "",
      email: "",
      userExists: false,
      userId: null,
      userStatus: null,
      userPets: null,
      budget: 0,
    }],
    residentGroupId: residentGroupId,
  });

  const existingUsers = []
  const newUsers = []

  const checkFlatmates = () => {
    const flatmates = data.flatmates
    flatmates.map((flatmate) => {
      flatmate.userExists?
      !existingUsers.includes(flatmate.firstName) && existingUsers.push(flatmate.firstName)  
      :
      !newUsers.includes(flatmate.firstName) && newUsers.push(flatmate.firstName)   
    })
    return {existingUsers, newUsers} 
  }

  const [currentStep, setCurrentStep] = useState(0);
  
  console.log(data);

  function preparePayloads(formData, userId, profileData, residentGroupId, newGroup) {

    let invitedFlatmates = []
    let existingUsers = []
    let newUsers = []

    formData.flatmates.map((flatmate) => {
        
        let flatmatePayload = {
        user_id: (flatmate.userExists ? flatmate.userId : null),
        resident_group_id: residentGroupId,
        first_name: flatmate.firstName,
        last_name: flatmate.lastName,
        email: flatmate.email,
        status: (flatmate.userExists ? flatmate.userStatus : "invited"),
        pets: (flatmate.userExists ? flatmate.userPets : false),
        invited_by: userId,
        budget: flatmate.budget,
        }

        flatmate.userExists?
        existingUsers.push(flatmatePayload) && invitedFlatmates.push(flatmatePayload)
        :
        newUsers.push(flatmatePayload) && invitedFlatmates.push(flatmatePayload)

    })

    const residentGroupMembersPayload = {
        primaryResidentGroupMember: newGroup? 
        {
            user_id: userId,
            resident_group_id: residentGroupId,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            status: profileData.status,
            pets: profileData.pets,
            budget: profileData.budget,
        } 
        : 
        {},
        invitedFlatmates
    }
  
    return {
        invitedFlatmates: invitedFlatmates,
        existingUsers: existingUsers,
        newUsers: newUsers,
        residentGroupMembersPayload: residentGroupMembersPayload,
    }
}

async function createResidentGroup(createResidentGroupPayload) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/supabase/resident-groups/create', createResidentGroupPayload).then((result) => {
                const data = result
                console.log("API result: ", data);
                const createdResidentGroupId = data[0].id
                resolve(createdResidentGroupId)
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function createResidentGroupMembers(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/supabase/resident-group-members/create', request).then((result) => {
                const data = result
                console.log("API result: ", data); 
                
                let newResidentGroupMembers = []
                let existingResidentGroupMembers = []
                
                data.map((record) => {
                    !record.user_id? 
                    newResidentGroupMembers.push(record)
                    :
                    existingResidentGroupMembers.push(record)
                })
        
                console.log("newResidentGroupMembers: ", newResidentGroupMembers)
                console.log("existingResidentGroupMembers: ", existingResidentGroupMembers)

                resolve({
                    data: data, 
                    newResidentGroupMembers: newResidentGroupMembers, 
                    existingResidentGroupMembers: existingResidentGroupMembers
                })

            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function updateResidentGroupBudget(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            // Update the resident group budget
            const { data, error } = await supabase
            .rpc('update_resident_group_budget', { group_id: request })

            if (error) {
              console.log("Supabase error:", error)
              resolve("Supabase error:", error)
            } else {
              console.log("groupBudget: ", data);
              resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function updateExistingUserProfiles(existingResidentGroupMembers) {
    return new Promise(resolve => {
      (async () => {
        try {
            const profilesPayload = {}

            existingResidentGroupMembers.map((user) => {
            let key = user.user_id
            let value = {payload: {resident_group: true}}
            profilesPayload[key] = value
            })

            await post('/api/supabase/profiles/update', profilesPayload).then((result) => {
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

async function updateExistingUserResidentApplications(existingResidentGroupMembers, residentGroupId) {
    return new Promise(resolve => {
      (async () => {

        const residentsWithApplications = existingResidentGroupMembers.filter(function(resident) {
            return resident.status === "pre-approved" || resident.status === "approved"; 
        })

        if (residentsWithApplications.length > 0) {

            const residentApplicationsPayload = {}

            residentsWithApplications.map((resident) => {
            let key = resident.user_id
            let value = {payload: {
                group: true,
                resident_group_id: residentGroupId
            }}
            residentApplicationsPayload[key] = value
            })

            try {
                await post('/api/supabase/resident-applications/update', residentApplicationsPayload).then((result) => {
                    const data = result
                    console.log("API result: ", data);
                    resolve(data)
                })
            } catch (error) {
                console.log("API error: ", error);
                resolve(error)
            }
        } else {
            console.log("no resident applications to update");
            resolve("no resident applications to update")
        }
      })()
    })
}

async function checkResidentGroupStatus(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            // Get all resident group members
            const { data, error } = await supabase
            .from("resident_group_members")
            .select()
            .eq("resident_group_id", request)

            if (error) {
              console.log("Supabase error:", error)
              resolve("Supabase error:", error)

            } else {
              // Check if all group members are pre-approved
              console.log("resident_group_members: ", data)
              
              function containsOnly(array1, array2){
                return array2.every(elem => array1.includes(elem))
              }
              
              let groupMemberStatus = data.map((groupMember) => groupMember.status)
              console.log('groupMemberStatus: ', groupMemberStatus);

              let groupPreApproved = containsOnly(["pre-approved"], groupMemberStatus)
              console.log('groupPreApproved: ', groupPreApproved);

              let groupMemberPets = data.map((groupMember) => groupMember.pets)
              console.log('groupMemberPets: ', groupMemberPets);

              let groupPets = !containsOnly([false], groupMemberPets)
              console.log('groupPets: ', groupPets);

              resolve({
                groupPreApproved: groupPreApproved,
                groupPets: groupPets,
              })
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function updateResidentGroupStatus(groupApproved, groupPets, residentGroupId) {
    return new Promise(resolve => {
      (async () => {
        try {
            let groupStatus = ''
            let groupHasPets = false

            if (groupApproved) {
                groupStatus = 'pre-approved'
            } else {
                groupStatus = 'not-approved'
            }

            if (groupPets) {
                groupHasPets = true
            } else {
                groupHasPets = false
            }

            // Update resident group status
            const { data, error } = await supabase
            .from("resident_groups")
            .update({ 
              status: groupStatus, 
              pets: groupHasPets 
            })
            .eq('id', residentGroupId)

            if (error) {
            console.log("Supabase error:", error)
            resolve("Supabase error:", error)
            } else {
            console.log("resident_group: ", data);
            resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function sendNotifications(userId, userEmail, profileData, newResidentGroupMembers, existingResidentGroupMembers) {
    return new Promise(resolve => {
      (async () => {
        try {

            const eventTitle = "Add Flatmates Form Submitted"
            const eventUserId = user.id
            const eventEmail = user.email
            const eventProperties = {
                name: profileData.first_name + " " + profileData.last_name,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                user_type: profileData.user_type
            }

            // Track Segment Event - Add Flatmates Form Submitted
            trackFormSubmitted(eventTitle, eventUserId, eventEmail, eventProperties)

            // Trigger Segment track event for each New Resident Invited
            newResidentGroupMembers.map((newResident) => {
                        
            const eventTitle = "New Resident Group Member Invited"
            const eventUserId = userId
            const eventEmail = userEmail
            const eventProperties = {
                first_name: newResident.first_name,
                email: newResident.email,
                invited_by: profileData.first_name,
                sign_up_url: "https://dev.stayhamlet.com/auth/sign-in?resident_group_members_id=" + newResident.id + "&resident_group_id=" + newResident.resident_group_id,
            }
            
            trackNewResidentInvited(eventTitle, eventUserId, eventEmail, eventProperties)
            
            })

            // Trigger Segment track event for each Existing Resident Invited
            let existingResidentGroupMembersToInvite = existingResidentGroupMembers.filter(function(resident) {
            return resident.user_id != userId
            })

            existingResidentGroupMembersToInvite.map((existingResident) => {
            
            const eventTitle = "Existing Resident Group Member Invited"
            const eventUserId = userId
            const eventEmail = userEmail
            const eventProperties = {
                first_name: existingResident.first_name,
                email: existingResident.email,
                invited_by: profileData.first_name,
                userId: existingResident.user_id,
            }
            
            trackExistingResidentInvited(eventTitle, eventUserId, eventEmail, eventProperties)
            
            })

            resolve("segment track events triggered, notifications sent")

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function makeRequest(formData, userId, userEmail, profileData, residentGroupId) {

    return new Promise(resolve => {
  
        (async () => {

            let finalResidentGroupId = residentGroupId

            let finalInvitedFlatmates = [];
            let finalExistingUsers = [];
            let finalNewUsers = [];
            let finalResidentGroupMembersPayload = {};

            if (finalResidentGroupId) {

                const {
                    invitedFlatmates,
                    existingUsers,
                    newUsers,
                    residentGroupMembersPayload,
                } = preparePayloads(formData, userId, profileData, finalResidentGroupId, false)
          
                console.log({
                    invitedFlatmates: invitedFlatmates, 
                    existingUsers: existingUsers, 
                    newUsers: newUsers,
                    residentGroupMembersPayload: residentGroupMembersPayload,
                })

                finalInvitedFlatmates = invitedFlatmates
                finalExistingUsers = existingUsers
                finalNewUsers = newUsers
                finalResidentGroupMembersPayload = residentGroupMembersPayload

            } else {
            
                const createResidentGroupPayload = {user_id: userId}
                console.log("createResidentGroupPayload: ", createResidentGroupPayload)

                try {
                    const result1 = await createResidentGroup(createResidentGroupPayload);
                    console.log("result1: ", result1);
                    finalResidentGroupId = result1

                    const {
                        invitedFlatmates,
                        existingUsers,
                        newUsers,
                        residentGroupMembersPayload,
                    } = preparePayloads(formData, userId, profileData, finalResidentGroupId, true)
              
                    console.log({
                        invitedFlatmates: invitedFlatmates, 
                        existingUsers: existingUsers, 
                        newUsers: newUsers,
                        residentGroupMembersPayload: residentGroupMembersPayload,
                    })
    
                    finalInvitedFlatmates = invitedFlatmates
                    finalExistingUsers = existingUsers
                    finalNewUsers = newUsers
                    finalResidentGroupMembersPayload = residentGroupMembersPayload

                } catch (error) {
                    console.log("error: ", error);
                    resolve(error)
                }

            }

            let newResidentGroupMembersPayload = []
            let existingResidentGroupMembersPayload = []

            try {
                const {data, newResidentGroupMembers, existingResidentGroupMembers} = await createResidentGroupMembers(finalResidentGroupMembersPayload);
                console.log(data, newResidentGroupMembers, existingResidentGroupMembers);
                newResidentGroupMembersPayload = newResidentGroupMembers
                existingResidentGroupMembersPayload = existingResidentGroupMembers
            } catch (error) {
                console.log("error: ", error);
                resolve(error)
            }
          
            try {
                const result2 = await updateResidentGroupBudget(finalResidentGroupId);
                console.log("result2: ", result2);
            } catch (error) {
                console.log("error: ", error);
                resolve(error)
            }
  
  
            try {
                const result3 = await updateExistingUserProfiles(existingResidentGroupMembersPayload);
                console.log("result3: ", result3);
            } catch (error) { 
                console.log("error: ", error);
                resolve(error)
            }

            try {
                const result4 = await updateExistingUserResidentApplications(existingResidentGroupMembersPayload, finalResidentGroupId);
                console.log("result4: ", result4);
            } catch (error) { 
                console.log("error: ", error);
                resolve(error)
            }
  
            let groupIsApproved = false
            let groupHasPets = false

            try {
                const {groupPreApproved, groupPets} = await checkResidentGroupStatus(finalResidentGroupId);
                console.log(groupPreApproved, groupPets);
                groupIsApproved = groupPreApproved
                groupHasPets = groupPets
            } catch (error) {
                console.log("error: ", error);
                resolve(error)
            }
  
            try {
                const result6 = await updateResidentGroupStatus(groupIsApproved, groupHasPets, finalResidentGroupId);
                console.log("result6: ", result6);
            } catch (error) {
                console.log("error: ", error);
                resolve(error)
            }
  
            try {
                const result7 = await sendNotifications(userId, userEmail, profileData, newResidentGroupMembersPayload, existingResidentGroupMembersPayload);
                console.log("result7: ", result7);
            } catch (error) {
                console.log("error: ", error);
                resolve(error)
            }
  
            resolve("success")
  
          })();
  
    })
  
}

async function handleFormSubmit(formData, userId, userEmail, profileData, residentGroupId) {

  return new Promise(resolve => {
    (async () => {
      try {
        console.log("submitting: ", submitting);
        const result = await makeRequest(formData, userId, userEmail, profileData, residentGroupId);
        if (result === "success") {
            console.log("nice, the function worked all the way through");
        } else {
            console.log("too bad, the function failed along the way");
        }
        setSubmitted(true)
        setSubmitting(false)
        setCounter(5)
        setTimeout(() => router.reload(window.location.pathname), 5000);
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
      handleFormSubmit(newData, user.id, user.email, profileData, residentGroupId)
    }
  
    setCurrentStep((prev) => prev + 1)
  }
  
  const handlePrevStep = (newData) => {
    setData((prev) => ({...prev, ...newData}));
    setCurrentStep((prev) => prev - 1)
  }

  const steps = [
    <StepOne next={handleNextStep} prev={handlePrevStep} data={data} submitting={() => setSubmitting(true)}/>,
  ]

  const headerContent = 
    {
      title: "Nice one!",
      description: 
      (typeof data.flatmates === "undefined" ? null : "Thanks for that. " 
      + (checkFlatmates().existingUsers.length > 0 ? "Looks like " + checkFlatmates().existingUsers.map((firstName) => firstName).join(', ').replace(/,(?!.*,)/gmi, ' and ') + (checkFlatmates().existingUsers.length > 1 ? " have " : " has " ) + "already signed up, we've added them to your group. " : "" )
      + (checkFlatmates().newUsers.length > 0 ? "We've sent " + checkFlatmates().newUsers.map((firstName) => firstName).join(', ').replace(/,(?!.*,)/gmi, ' and ') + " an email with a link to join Hamlet." : "" )
      ),
    }
  
      return (
        <>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={onClose}>
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                      <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="bg-indigo-600 px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between space-x-3">
                              <div className="space-y-1">
                                <Dialog.Title className="text-lg font-medium text-white">Invite Flatmates</Dialog.Title>
                                <p className="text-sm text-indigo-300">
                                  Fill in the information below to invite your flatmates.
                                </p>
                              </div>
                              <div className="flex h-7 items-center">
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                  onClick={onClose}
                                >
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {!(submitted || submitting) &&
                          <>
                          {/* INSERT STEPS HERE */}
                          {steps[currentStep]}
                          </>
                          }

                          {submitting &&
                          <>
                          <div className="flex justify-center space-y-6 py-6 sm:space-y-0 sm:py-0">
                            <div className="mt-4">
                                <Loader loading={true}/>
                            </div>
                          </div>    
                          </>
                          }

                          {submitted &&
                          <>
                          <div className="space-y-6 py-6 sm:space-y-0 sm:py-0">
                            <div className="mt-4">
                              <div className="space-y-1 px-4 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5 grid grid-cols-1 gap-y-4"> 
                                <DashboardHeader headerContent={headerContent} />
                                <div className='py-6'>
                                    <div className="rounded-md bg-indigo-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                            <InformationCircleIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3 flex-1 md:flex md:justify-between">
                                                <p className="text-sm font-semibold text-blue-700">
                                                This page will refresh in {counter} seconds...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>    
                          </>
                          }
                          
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        </>
      )
    }