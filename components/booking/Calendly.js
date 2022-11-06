import React from "react";
import { InlineWidget } from "react-calendly";
import { useUser } from "@supabase/auth-helpers-react";

const Calendly = ({user, profile}) => {
  const {email} = useUser()
  const {first_name, last_name} = profile
  
  return (
    <>
    {!user? null :

    <div className="App flex">
    <div className="App w-full">
      <InlineWidget 
      url="https://calendly.com/stayhamlet/homeowner-introduction" 
      styles={{
        height: '500px',
      }}
      pageSettings={{
        backgroundColor: 'ffffff',
        hideEventTypeDetails: true,
        hideLandingPageDetails: false,
        primaryColor: '667eea',
        textColor: '4d5055'
      }}
      prefill={{
        email: user.email,
        name: profile.first_name + ' ' + profile.last_name,
      }}/>
    </div>
    </div>
    }
    </>
  );
};

export default Calendly;