// utils/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey
)

export const getOnboardingStatus = async (userId) => {
  const supabase = getSupabase(userId)
  let { data: users, error } = await supabase
    .from('users')
    .select('is_onboarding')
    .eq('user_id', userId)

    const onboardingStatus = users[0].is_onboarding
    
    return onboardingStatus
  }

export const postOnboardingData = async (userId, formData) => {
  try {
    const supabase = getSupabase(userId)
    let { data: users, error } = await supabase
      .from('users')
      .update(
        {
          user_type: formData.userType, 
          first_name: formData.firstName, 
          last_name: formData.lastName, 
          is_onboarding: false
        }
      )
      .eq('user_id', userId)
      .select()
  } catch (error) {
      console.log(error)
      const errorString = JSON.stringify(error)
      return res.status(400).json({ errorString })
  }
    const response = users 
    return response
}

export async function createResidentGroup (request) {
  try {
      const res = await fetch(`/api/supabase/resident-groups/create` + '?' + (new URLSearchParams(request)).toString());
      const data = await res.json();
      console.log("API result: ", data);
      return data
  } catch (err) {
      console.log("API error: ", err);
  }
}


  