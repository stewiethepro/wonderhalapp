import React from "react";
import Dropzone from 'react-dropzone';
import { useState } from "react";

export default function UploadInput( props ) {

  const [data, setData] = useState([])
  console.log(data);

  return (

    <>

    <img src="[supabase_url]/storage/v1/object/public/[bucket name]/[path to your image]" />

    <Dropzone onDrop={acceptedFiles => {
        setData((prev) => ({...prev, ...acceptedFiles}));
        console.log(data)
    }}>
        {({getRootProps, getInputProps, isDragActive}) => (
            <section>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button
                type="button"
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                    />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">
                    {isDragActive ? 
                    "Drop your files here..."
                    : 
                    "Drag and drop your files or click here to upload"
                    }
                </span>
                </button>
            </div>
            </section>
        )}
    </Dropzone>

    </>
  )
}

  