import ScaleLoader from "react-spinners/ScaleLoader";

export default function Loader({loading}) {

    return (
        <ScaleLoader 
            color={"#6366f1"} 
            loading={loading} 
            size={150} 
        />
    )
}

