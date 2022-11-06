/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { 
  ChevronRightIcon, 
  MinusCircleIcon as MinusCircleIconSolid,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid'
import { 
    PaperAirplaneIcon,  
    UserCircleIcon, 
    IdentificationIcon,
    CheckBadgeIcon,  
    EnvelopeIcon,
} from '@heroicons/react/24/solid'
import { PlusCircleIcon, MinusCircleIcon as MinusCircleIconOutline } from '@heroicons/react/24/outline'
import AddFlatmates from '@/components/forms/resident/add-flatmates/AddFlatmatesForm'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'
import { get, post } from '@/utils/api/request'
import Warning from '../forms/utility/Warning'
import { 
  trackResidentGroupDeleted, 
  trackResidentGroupDeletedNewResidentNotified, 
  trackResidentGroupDeletedExistingResidentNotified,
  trackResidentGroupMemberDeleted,
  trackResidentGroupMemberDeletedNewResidentNotified,
  trackResidentGroupMemberDeletedExistingResidentNotified, 
} from '@/utils/segment/track'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function FlatmatesList({user, profileData, people, groups}) {
  const [openModal, setOpenModal] = useState(false)
  const [openWarning, setOpenWarning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [warningProps, setWarningProps] = useState(
    {
      title: "",
      message: "",
      actionButton: {
        title: "",
        onClick: "",
      }
    }
  )
  const [counter, setCounter] = useState(0);
  const router = useRouter()
  const [residentGroupId, setResidentGroupId] = useState() 

  console.log("profileData: ", profileData);

  if (user) {
    const userId = user.id
    const userEmail = user.email
  }

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  function openDeleteGroupWarning(groupId, people){
    setWarningProps(
      {
        title: "Delete Group?",
        message: "Are you sure you want to delete this group?",
        actionButton: {
          title: "Delete group",
          onClick: () => deleteGroup(groupId, people, user.id, user.email, profileData)
        }
      }
    )
    setOpenWarning(true)
  }

  function openDeleteGroupMemberWarning(groupId, person){
    setWarningProps(
      {
        title: "Remove " + person.first_name + "?",
        message: "Are you sure you want to remove " + person.first_name + " from this group?",
        actionButton: {
          title: "Remove " + person.first_name,
          onClick: () => deleteGroupMember(groupId, person, user.id, user.email, profileData)
        }
      }
    )
    setOpenWarning(true)
  }

  function openAddFlatmatesModal(residentGroupId) {
    setResidentGroupId(residentGroupId)
    setOpenModal(true)
  }

  // Delete Group Member Functions

  function prepareDeleteGroupMemberPayloads(residentGroupId, residentGroupMember) {
    // filter through people and get userIds of resident group members from selected resident group
    const deleteResidentGroupMemberPayload = residentGroupMember.id
    
    const checkResidentGroupMemberPayload = [residentGroupMember.user_id]

    const checkResidentGroupMemberRequest = {}

    checkResidentGroupMemberPayload.map((resident, index) => {
        let key = 'id' + (index + 1)
        let value = resident
        checkResidentGroupMemberRequest[key] = value
    })

    const updateApplicationPayload = [residentGroupMember]

    return {
        deleteResidentGroupMemberPayload: deleteResidentGroupMemberPayload,
        checkResidentGroupMemberRequest: checkResidentGroupMemberRequest,
        updateApplicationPayload: updateApplicationPayload,
    }
}

async function updateResidentApplication(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/supabase/resident-applications/update', request).then((result) => {
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

async function updateExistingUserResidentApplications(request) {
  return new Promise(resolve => {
    (async () => {

      const residentsWithApplications = request.filter(function(resident) {
          return resident.status === "pre-approved" || resident.status === "approved"; 
      })

      if (residentsWithApplications.length > 0) {

          const residentApplicationsPayload = {}

          residentsWithApplications.map((resident) => {
          let key = resident.user_id
          let value = {payload: {
              group: false,
              resident_group_id: null
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

async function deleteResidentGroupMember(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            // delete the resident group members
            const { data, error } = await supabase
            .from('resident_group_members')
            .delete()
            .eq('id', request)

            if (error) {
                console.log("Supabase error:", error)
                resolve(error)
            } else {
                console.log("resident_group_member: ", data);
                resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function checkResidentGroupMember(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            let groupResidents = []
            let soloResidents = []

            await get('/api/supabase/resident-group-members/get', request).then((result) => {
                const data = result
                console.log("API result: ", data);

                data.map((resident) => {
                    const {email, userExists} = resident
                    if (userExists) {
                        console.log(email + " is still in a resident group");
                        groupResidents.push(resident)
                    } else {
                        console.log(email + " is not in a resident group");
                        soloResidents.push(resident)
                    }
                })

                console.log("groupResidents: ", groupResidents);
                console.log("soloResidents: ", soloResidents);

                resolve({
                    data: data, 
                    groupResidents: groupResidents, 
                    soloResidents: soloResidents
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

              resolve(groupPreApproved)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function updateResidentGroupStatus(groupApproved, request) {
    return new Promise(resolve => {
      (async () => {
        try {
            if (groupApproved) {
                // Update resident group status
                const { data, error } = await supabase
                .from("resident_groups")
                .update({ status: 'pre-approved' })
                .eq('id', request)

                if (error) {
                console.log("Supabase error:", error)
                resolve("Supabase error:", error)
                } else {
                console.log("resident_group: ", data);
                resolve(data)
                }
            } else {
                // All members are not yet pre-approved
                console.log("This resident group is not pre-approved yet");
                resolve("This resident group is not pre-approved yet")
            }
        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function sendDeleteGroupMemberNotifications(userId, userEmail, profileData, residentGroupId, residentGroupMember) {
  return new Promise(resolve => {
    (async () => {
      try {

          const eventTitle = "Resident Group Member Deleted"
          const eventUserId = userId
          const eventEmail = userEmail
          const eventProperties = {
              group_id: residentGroupId,
              resident_group_member_id: residentGroupMember.id,
              deleted_user: {
                first_name: residentGroupMember.first_name
              }
          }

          // Track Segment Event - Add Flatmates Form Submitted
          trackResidentGroupMemberDeleted(eventTitle, eventUserId, eventEmail, eventProperties)

          if (residentGroupMember.user_id) {

            const eventTitle = "Resident Group Member Deleted Existing Resident Notified"
            const eventUserId = userId
            const eventEmail = userEmail
            const eventProperties = {  
              group_id: residentGroupId,
              deleted_by: profileData.first_name,
              deleted_user: {
                first_name: residentGroupMember.first_name,
                email: residentGroupMember.email,
                userId: residentGroupMember.user_id,
              }
            }
            
            trackResidentGroupMemberDeletedExistingResidentNotified(eventTitle, eventUserId, eventEmail, eventProperties)

          } else {

            const eventTitle = "Resident Group Member Deleted New Resident Notified"
            const eventUserId = userId
            const eventEmail = userEmail
            const eventProperties = {  
              group_id: residentGroupId,
              deleted_by: profileData.first_name,
              deleted_user: {
                first_name: residentGroupMember.first_name,
                email: residentGroupMember.email,
              }
            }
            
            trackResidentGroupMemberDeletedNewResidentNotified(eventTitle, eventUserId, eventEmail, eventProperties)
            
          }

          resolve("segment track events triggered, notifications sent")

      } catch (error) {
          console.log("API error: ", error);
          resolve(error)
      }
    })()
  })
}

// Delete Group Functions

function prepareDeleteGroupPayloads(residentGroupId, people) {
  // filter through people and get userIds of resident group members from selected resident group
  const checkResidentGroupMembersPayload = people.flatMap((person) => {
      if (person.resident_group_id !== residentGroupId) {
      return [];
      }
      return [person.user_id];
  });

  const checkResidentGroupMembersRequest = {}

  checkResidentGroupMembersPayload.map((resident, index) => {
      let key = 'id' + (index + 1)
      let value = resident
      checkResidentGroupMembersRequest[key] = value
  })

  const updateApplicationPayload = people.flatMap((person) => {
    if (person.resident_group_id !== residentGroupId) {
    return [];
    }
    return [person];
  })

  const deleteResidentGroupPayload = {
  resident_group_id: residentGroupId
  }

  const newResidentGroupMembers = []
  const existingResidentGroupMembers = []
  
  updateApplicationPayload.map((record) => {
      !record.user_id? 
      newResidentGroupMembers.push(record)
      :
      existingResidentGroupMembers.push(record)
  })

  return {
      checkResidentGroupMembersRequest: checkResidentGroupMembersRequest,
      updateApplicationPayload: updateApplicationPayload,
      deleteResidentGroupPayload: deleteResidentGroupPayload,
      newResidentGroupMembers: newResidentGroupMembers,
      existingResidentGroupMembers: existingResidentGroupMembers,
  }
}

async function updateResidentApplications(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/supabase/resident-applications/update', request).then((result) => {
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

async function deleteResidentGroupMembers(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            // delete the resident group members
            const { data, error } = await supabase
            .from('resident_group_members')
            .delete()
            .eq('resident_group_id', request)

            if (error) {
                console.log("Supabase error:", error)
                resolve(error)
            } else {
                console.log("resident_group_members: ", data);
                resolve(data)
            }

        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function deleteResidentGroup(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await post('/api/supabase/resident-groups/delete', request).then((result) => {
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

async function checkResidentGroupMembers(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            let groupResidents = []
            let soloResidents = []

            await get('/api/supabase/resident-group-members/get', request).then((result) => {
                const data = result
                console.log("API result: ", data);

                data.map((resident) => {
                    const {email, userExists} = resident
                    if (userExists) {
                        console.log(email + " is still in a resident group");
                        groupResidents.push(resident)
                    } else {
                        console.log(email + " is not in a resident group");
                        soloResidents.push(resident)
                    }
                })

                console.log("groupResidents: ", groupResidents);
                console.log("soloResidents: ", soloResidents);

                resolve({
                    data: data, 
                    groupResidents: groupResidents, 
                    soloResidents: soloResidents
                })
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error)
        }
      })()
    })
}

async function updateProfiles(soloResidents) {
    return new Promise(resolve => {
      (async () => {
        if (soloResidents.length > 0) {

            // define profiles payload
            const profilesPayload = {}
            
            soloResidents.map((user) => {
            let key = user.userId
            let value = {
                payload: {resident_group: false}
            }
            profilesPayload[key] = value
            })

            // update profile(s) of residents to resident_group = false
            try {
                await post('/api/supabase/profiles/update', profilesPayload).then((result) => {
                const data = result
                console.log("API result: ", data);
                resolve(data)
                })
            } catch (error) {
                console.log("API error: ", error);
                resolve(error)
            }
        } else {
            console.log("no profiles to update");
            resolve("no profiles to update")
        }
      })()
    })
}

async function sendDeleteGroupNotifications(userId, userEmail, profileData, residentGroupId, newResidentGroupMembers, existingResidentGroupMembers) {
  return new Promise(resolve => {
    (async () => {
      try {

          const eventTitle = "Resident Group Deleted"
          const eventUserId = userId
          const eventEmail = userEmail
          const eventProperties = {
              group_id: residentGroupId,
          }

          // Track Segment Event - Add Flatmates Form Submitted
          trackResidentGroupDeleted(eventTitle, eventUserId, eventEmail, eventProperties)

          // Trigger Segment track event for each New Resident Deleted
          newResidentGroupMembers.map((newResident) => {
                      
          const eventTitle = "Resident Group Deleted New Resident Notified"
          const eventUserId = userId
          const eventEmail = userEmail
          const eventProperties = {  
            group_id: residentGroupId,
            deleted_by: profileData.first_name,
            notified_user: {
              first_name: newResident.first_name,
              email: newResident.email,
            }
          }
          
          trackResidentGroupDeletedNewResidentNotified(eventTitle, eventUserId, eventEmail, eventProperties)
          
          })

          // Trigger Segment track event for each Existing Resident Invited
          let existingResidentGroupMembersToInvite = existingResidentGroupMembers.filter(function(resident) {
          return resident.user_id != userId
          })

          existingResidentGroupMembersToInvite.map((existingResident) => {

          const eventTitle = "Resident Group Deleted Existing Resident Notified"
          const eventUserId = userId
          const eventEmail = userEmail
          const eventProperties = {  
            group_id: residentGroupId,
            deleted_by: profileData.first_name,
            notified_user: {
              first_name: existingResident.first_name,
              email: existingResident.email,
              userId: existingResident.user_id,
            }
          }
          
          trackResidentGroupDeletedExistingResidentNotified(eventTitle, eventUserId, eventEmail, eventProperties)
          
          })

          resolve("segment track events triggered, notifications sent")

      } catch (error) {
          console.log("API error: ", error);
          resolve(error)
      }
    })()
  })
}

async function supabaseDeleteGroupMember(residentGroupId, residentGroupMember, userId, userEmail, profileData) {

  return new Promise(resolve => {

      const {
          deleteResidentGroupMemberPayload, 
          updateApplicationPayload, 
          checkResidentGroupMemberRequest
      } = prepareDeleteGroupMemberPayloads(residentGroupId, residentGroupMember)

      console.log({
          deleteResidentGroupMemberPayload: deleteResidentGroupMemberPayload, 
          updateApplicationPayload: updateApplicationPayload, 
          checkResidentGroupMemberRequest: checkResidentGroupMemberRequest
      });

      (async () => {
          try {
              const result1 = await updateExistingUserResidentApplications(updateApplicationPayload);
              console.log("result1: ", result1);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }
        
          try {
              const result2 = await deleteResidentGroupMember(deleteResidentGroupMemberPayload);
              console.log("result2: ", result2);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          let updateProfilePayload = []

          try {
              const {data, groupResidents, soloResidents} = await checkResidentGroupMember(checkResidentGroupMemberRequest)
              console.log(data, groupResidents, soloResidents);
              updateProfilePayload = soloResidents
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          try {
              const result4 = await updateProfiles(updateProfilePayload)
              console.log("result4: ", result4);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          try {
              const result5 = await updateResidentGroupBudget(residentGroupId)
              console.log("result5: ", result5);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          let groupApproved = false

          try {
              const result6 = await checkResidentGroupStatus(residentGroupId)
              console.log("result6: ", result6);
              groupApproved = result6
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          try {
              const result7 = await updateResidentGroupStatus(groupApproved, residentGroupId)
              console.log("result7: ", result7);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          try {
            const result8 = await sendDeleteGroupMemberNotifications(userId, userEmail, profileData, residentGroupId, residentGroupMember);
            console.log("result8: ", result8);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          resolve("success")

        })();

  })

}

async function supabaseDeleteGroup(residentGroupId, people, userId, userEmail, profileData) {

    return new Promise(resolve => {

        const {
            checkResidentGroupMembersRequest, 
            updateApplicationPayload, 
            deleteResidentGroupPayload,
            newResidentGroupMembers,
            existingResidentGroupMembers
        } = prepareDeleteGroupPayloads(residentGroupId, people);

        console.log(
            checkResidentGroupMembersRequest, 
            updateApplicationPayload, 
            deleteResidentGroupPayload,
            newResidentGroupMembers,
            existingResidentGroupMembers
        );

        (async () => {
          try {
              const result1 = await updateExistingUserResidentApplications(updateApplicationPayload);
              console.log("result1: ", result1);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }
        
          try {
              const result2 = await deleteResidentGroupMembers(residentGroupId)
              console.log("result2: ", result2);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          try {
              const result3 = await deleteResidentGroup(deleteResidentGroupPayload)
              console.log("result3: ", result3);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          let updateProfilesPayload = []

          try {
              const {data, groupResidents, soloResidents} = await checkResidentGroupMembers(checkResidentGroupMembersRequest)
              console.log(data, groupResidents, soloResidents);
              updateProfilesPayload = soloResidents
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          try {
              const result5 = await updateProfiles(updateProfilesPayload)
              console.log("result5: ", result5);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          try {
            const result6 = await sendDeleteGroupNotifications(userId, userEmail, profileData, residentGroupId, newResidentGroupMembers, existingResidentGroupMembers);
            console.log("result6: ", result6);
          } catch (error) {
              console.log("error: ", error);
              resolve(error)
          }

          resolve("success")

        })();

    })
}

async function deleteGroupMember(residentGroupId, residentGroupMember, userId, userEmail, profileData) {
  setLoading(true)
  const result = await supabaseDeleteGroupMember(residentGroupId, residentGroupMember, userId, userEmail, profileData)
  if (result === "success") {
      console.log("nice, the function worked all the way through");
  } else {
      console.log("too bad, the function failed along the way");
  }
  setLoading(false)
  setOpenWarning(false)
  setTimeout(() => router.reload(window.location.pathname), 1000)
}

async function deleteGroup(residentGroupId, people, userId, userEmail, profileData) {
  setLoading(true)
  const result = await supabaseDeleteGroup(residentGroupId, people, userId, userEmail, profileData)
  if (result === "success") {
      console.log("nice, the function worked all the way through");
  } else {
      console.log("too bad, the function failed along the way");
  }
  setLoading(false)
  setOpenWarning(false)
  setTimeout(() => router.reload(window.location.pathname), 1000)
}

  return (
    <>
    
    {groups.length > 0 ? 

    <>

    {groups.map((group) => (
      <>
      {/* Page heading */}
      <header className="bg-gray-50 py-8">
        
      </header>
      <div key={group.id} className="overflow-visible mb-10 bg-white shadow sm:rounded-md">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {"Group " + group.id}
              </h1>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  {group.status === "pre-approved" && 
                    <>
                    <CheckBadgeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-400" aria-hidden="true" />
                    Pre-approved
                    </>
                  }
                  {group.status === "not-approved" && 
                    <>
                    <MinusCircleIconSolid className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-400" aria-hidden="true" />
                    Not approved
                    </>
                  }
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-amber-400" aria-hidden="true" />
                  {"$" + group.budget.toLocaleString() + " / week"}
                </div>
              </div>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    Group options
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={() => openAddFlatmatesModal(group.id)}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            <UserPlusIcon
                              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            Add flatmate
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={() => openDeleteGroupWarning(group.id, people)}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                            Delete group
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              </div>

          </div>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {people.map((person) => (
            <>
            {person.resident_group_id === group.id &&
              <li key={person.id}>
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="min-w-0 flex-1 items-center md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="truncate text-sm font-medium text-indigo-600">{person.first_name + " " + (person.last_name? person.last_name : "") }</p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <EnvelopeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          <span className="truncate">{person.email}</span>
                        </p>
                      </div>
                      <div className="block">
                        <div>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            {person.status === "invited" && 
                              <>
                              <PaperAirplaneIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-yellow-400" aria-hidden="true" />
                              Invited
                              </>
                            }
                            {person.status === "prospect" && 
                              <>
                              <UserCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-orange-400" aria-hidden="true" />
                              Signed up
                              </>
                            }
                            {person.status === "onboarded" && 
                              <>
                              <IdentificationIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-teal-400" aria-hidden="true" />
                              Onboarded
                              </>
                            }
                            {person.status === "pre-approved" && 
                              <>
                              <CheckBadgeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-400" aria-hidden="true" />
                              Pre-approved
                              </>
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 mt-4 flex-shrink-0">
                    {person.user_id !== user.id ? 
                    <>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                          Options
                          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {person.status === "invited" && 
                          <>
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                      'group flex items-center px-4 py-2 text-sm'
                                    )}
                                  >
                                    <EnvelopeIcon
                                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    Resend invite
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </>
                          }
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  onClick={() => openDeleteGroupMemberWarning(group.id, person)}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'group flex items-center px-4 py-2 text-sm'
                                  )}
                                >
                                  <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                  Remove flatmate
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    </>
                    :
                    <>
                    <span className="ml-28">
                      
                    </span>
                    </>
                    }
                  </div>
                </div>
              </li>
          }
          </>
          ))}
        </ul>
      </div>
    </>
    ))}

    </>
    :
    <>

    <div className="">
      
      <div className="mt-6">
        <button
          type="button"
          onClick={() => openAddFlatmatesModal(null)}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add flatmates
        </button>
      </div>
    </div>

    </>
    }

    <AddFlatmates open={openModal} onClose={() => setOpenModal(false)} user={user} profileData={profileData} residentGroupId={residentGroupId}/>
    
    <Warning open={openWarning} onClose={() => setOpenWarning(false)} loading={loading} warningProps={warningProps} />
    
    </>
  )
}
