import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function CalScheduler({user, profile, eventTypeLink}) {
  const calLink = eventTypeLink

  useEffect(()=>{
    (async function () {
      const cal = await getCalApi();
      cal();
    })();
  }, [user])

  return (

  <>
  {!user? null :

  <Cal
    calLink={calLink}
    config={{
      name: profile.first_name + " " + profile.last_name,
      email: user.email,
      notes: "",
      guests: [],
      theme: "light",
      metadata: user.id
    }}
    style={{width:"100%",height:"100%",overflow:"scroll"}}
  />
  }
  </> 

  )
}