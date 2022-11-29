import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";
import { Inbox } from "@trycourier/react-inbox";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const courierClientKey = process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY

export default function Courier ({ children }) {
  const user = useUser()
  const [loadCourier, setLoadCourier] = useState(false)
  
  const handleOnMessage = (message) => {
    console.log(message);
    return message;
  };

  useEffect(() => {
    setLoadCourier(true)
  }, [])

  return (
    <>
    {loadCourier && user &&
      <CourierProvider 
        clientKey={courierClientKey} 
        userId={user.id}
        onMessage={handleOnMessage}
      >
        <Toast />
        <Inbox 
        theme={{
          container: {
            zIndex:"9999",
            fontFamily: "inter"
          }
        }}
        />
        {children}
      </CourierProvider>
    }
    </>
  );
};