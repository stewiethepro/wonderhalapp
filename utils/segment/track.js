// Pages

export const trackPage = (pageCategory, pageName, pageProperties) => {
    analytics.page(pageCategory, pageName, pageProperties)
}

// Identify
export const trackUserIdentify = (traits) => {
    analytics.identify(traits.id, {
      email: traits.email,
      name: traits.name,
      first_name: traits.first_name,
      last_name: traits.last_name,
      user_type: traits.user_type
    })
}

export const clearUserTraits = () => {
    analytics.user().traits({})
}

// Events
export const trackCalEvent = (analytics, eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            name: eventProperties.name,
            first_name: eventProperties.first_name,
            last_name: eventProperties.last_name
        }
    })
}

// Form submitted
export const trackFormSubmitted = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            name: eventProperties.name,
            first_name: eventProperties.first_name,
            last_name: eventProperties.last_name,
            user_type: eventProperties.user_type,
        }
    })
}

// Residents Invited
// // Existing Resident Invited  // //
export const trackExistingResidentInvited = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            invited_user: {
                first_name: eventProperties.first_name,
                userId: eventProperties.userId,
                email: eventProperties.email,
                invited_by: eventProperties.invited_by,
            }
        }
    })
}
 // // New Resident Invited // //
export const trackNewResidentInvited = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            invited_user: {
                first_name: eventProperties.first_name,
                email: eventProperties.email,
                invited_by: eventProperties.invited_by,
                sign_up_url: eventProperties.sign_up_url,
            }
        }
    })
}

// Resident Group Deleted //
export const trackResidentGroupDeleted = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            group_id: eventProperties.group_id,
        }
    })
}

// Resident Group Deleted Notify New Resident
export const trackResidentGroupDeletedNewResidentNotified = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            group_id: eventProperties.group_id,
            deleted_by: eventProperties.deleted_by,
            notified_user: {
                first_name: eventProperties.notified_user.first_name,
                email: eventProperties.notified_user.email,
            }
        }
    })
}

// Resident Group Deleted Notify Existing Resident
export const trackResidentGroupDeletedExistingResidentNotified = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            group_id: eventProperties.group_id,
            deleted_by: eventProperties.deleted_by,
            notified_user: {
                first_name: eventProperties.notified_user.first_name,
                email: eventProperties.notified_user.email,
                userId: eventProperties.notified_user.userId,
            }
        }
    })
}

// Resident Group Member Deleted //
export const trackResidentGroupMemberDeleted = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            group_id: eventProperties.group_id,
            resident_group_member_id: eventProperties.resident_group_member_id,
            deleted_user: {
                first_name: eventProperties.deleted_user.first_name,
            }
        }
    })
}

// Resident Group Member Deleted Notify New Resident
export const trackResidentGroupMemberDeletedNewResidentNotified = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            group_id: eventProperties.group_id,
            deleted_by: eventProperties.deleted_by,
            deleted_user: {
                first_name: eventProperties.deleted_user.first_name,
                email: eventProperties.deleted_user.email,
            }
        }
    })
}

// Resident Group Member Deleted Notify Existing Resident
export const trackResidentGroupMemberDeletedExistingResidentNotified = (eventTitle, eventUserId, eventEmail, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        email: eventEmail,
        properties: {
            group_id: eventProperties.group_id,
            deleted_by: eventProperties.deleted_by,
            deleted_user: {
                first_name: eventProperties.deleted_user.first_name,
                userId: eventProperties.deleted_user.userId,
                email: eventProperties.deleted_user.email,
            }
        }
    })
}

// Home Application Form submitted
export const trackHomeApplicationFormSubmitted = (eventTitle, eventUserId, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        properties: eventProperties,
    })
}

// Home Application Submitted Notify Resident
export const trackHomeApplicationSubmittedResidentNotified = (eventTitle, eventUserId, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        properties: eventProperties,
    })
}

// Home Application Deleted
export const trackHomeApplicationDeleted = (eventTitle, eventUserId, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        properties: eventProperties,
    })
}

// Home Application Deleted Notify Resident
export const trackHomeApplicationDeletedResidentNotified = (eventTitle, eventUserId, eventProperties) => {
    analytics.track({
        event: eventTitle,
        userId: eventUserId,
        properties: eventProperties,
    })
}


