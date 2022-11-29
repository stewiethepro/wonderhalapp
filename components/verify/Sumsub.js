import React from 'react';
import SumsubWebSdk from '@sumsub/websdk-react'

export default function Sumsub() {

console.log("Sumsub imported");

  return (
    <div className="Sumsub">
        <SumsubWebSdk
            accessToken={accessToken}
            expirationHandler={accessTokenExpirationHandler}
            config={config}
            options={options}
            onMessage={messageHandler}
            onError={errorHandler}
        />
    </div>
  );
}
