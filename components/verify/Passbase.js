import React, { useEffect } from 'react';
import dynamic from 'next/dynamic'
// import VerifyButton from '@passbase/button/react'

const VerifyButton = dynamic(
    () => import('@passbase/button/react'),
    { ssr: false }
);

export default function Passbase({user}) {

  console.log("Passbase imported");

  return (
    
    <div className="App">
    <VerifyButton
        apiKey="oUXNFUHJ5R7nIRoOo8lixm58AtVjulAGNBdldk3Q8jK4F9UmSnUilxqMMkROVRNr"
        onStart={() => {}}
        onError={(errorCode) => {}}
        onFinish={(identityAccessKey) => {}}
    />
    </div>

  );
}
