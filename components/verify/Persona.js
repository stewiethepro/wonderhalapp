import dynamic from 'next/dynamic'

export const PersonaInquiry = dynamic(
    () => import('persona').then((module) => module.Inquiry),
    {ssr: false}
  );

export default function Persona({user}) {

console.log("Persona imported");

  return (
    <>

    {!user? null :

    <div className="flex justify-center">
        <div className="persona-parent mx-auto -mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
            <PersonaInquiry
            templateId='itmpl_PmYqGPQ5HLe56RGcjghdu1Cr'
            environment='sandbox'
            onLoad={() => { console.log('Loaded inline'); }}
            onComplete={({ inquiryId, status, fields }) => {
                // Inquiry completed. Optionally tell your server about it.
                console.log(`Sending finished inquiry ${inquiryId} to backend`);
            }}
            referenceId={user.id}
            />
        </div>
    </div>

    }
    
    </>
  );
}