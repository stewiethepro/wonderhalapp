import Lottie from "lottie-react";
import loader from "@/lotties/loader.json";

export default function TransitionLoader() {
  
  const style = {
    height: 550
  };

    return (
      <>
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
          <div className="relative -mt-24 mx-auto">
            <div className="mx-auto max-w-md">
            <Lottie 
            animationData={loader} 
            style={style}
            />
            </div>
          </div>
        </div>
      </>
    )
  }
  