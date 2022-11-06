import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from "@/utils/supabase";
import { Formik, Form, useFormikContext } from "formik"
import * as Yup from "yup";
import TextInput from '@components/forms/inputs/TextInput';

export default function SignUp() {

    const handleSubmit = async (values) => {
      try {        
        let { user, error } = await supabase.auth.signIn(
          {email: values.email}, 
          {redirectTo: "http://dev.stayhamlet.com/onboarding/start"}, 
          {shouldCreateUser: true}
        )

        if (error) {
          throw new Error (authError.message)
        }
        
      } catch (error) {
        console.log(error); 
      }
    };

    const authValidation = Yup.object().shape({
      email: Yup
      .string()
      .required("Required")
      .email("Valid email required")
    });

    return (
       <>
          <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="mt-1 text-4xl font-extrabold text-indigo-600 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Sign up
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm lg:w-96">
                <div className='form-wrapper'>
                  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                      <Formik
                      initialValues={{
                        email: ""
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={authValidation}
                      >
                        <Form className="space-y-6">
                          <TextInput
                          name={"email"}
                          label={"Email Address"}
                          />
                          <div>
                            <button
                              type="submit"
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Sign up
                            </button>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  </div>    
                </div>
              </div>
            </div>
          </div>
       </>
    )
   }
   
   