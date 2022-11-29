import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { Formik, Form } from "formik"
import * as Yup from "yup";
import { getLayout } from "@/components/layout/SiteLayout";
import TextInput from '@/components/forms/inputs/TextInput';
import AuthSuccess from "@/components/forms/utility/AuthSuccess";
import { pages } from "@/utils/segment/constants/pages";


export default function SignIn() {
    const [submitted, setSubmitted] = useState(false)
    const [email, setEmail] = useState("")
    const router = useRouter()

    async function signInWithMagicLink(values) {
        const {query} = router
        const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&');
        console.log(queryString)
        let redirectLink = "https://dev.stayhamlet.com/welcome"
        {queryString? redirectLink = redirectLink + "?" + queryString : null }

        const { data, error } = await supabase.auth.signInWithOtp(
            {
              email: values.email,
              options: {
                redirectTo: redirectLink
              }
            }
        ) 
        if (error) {
            console.log({ error });
        } else {
            setEmail(values.email)
            setSubmitted(true)
            console.log(submitted);
        }
    }

    async function signInWithGoogle () {
        const {query} = router
        const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&');
        console.log(queryString)
        let redirectLink = "https://dev.stayhamlet.com/welcome"
        {queryString? redirectLink = redirectLink + "?" + queryString : null }
        const { user, session, error } = await supabase.auth.signInWithOAuth(
            {
              provider: 'google',
              options: {
                redirectTo: redirectLink
              }
            }
        )
        if (error) {
            console.log({ error });
        }
    }

    const authValidation = Yup.object().shape({
        email: Yup
        .string()
        .required("Required")
        .email("Valid email required")
    });

    return (
        <>
        <AuthSuccess submitted={submitted} email={email}/>
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
                                  
                        <div className="mt-6 grid">
            
                        <div>
                                <a
                                onClick={signInWithGoogle}
                                href="#"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <svg fill="currentColor" viewBox="0 0 30 30" width="20px" height="20px">    
                                        <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"/>
                                    </svg>
                                    <span className="ml-4">Sign in with Google</span>
                                </a>
                        </div>
                        </div>

                        <div className="mt-6"> 
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>
                        </div>


                      <Formik
                      initialValues={{
                        email: ""
                        }}
                        onSubmit={signInWithMagicLink}
                        validationSchema={authValidation}
                      >
                        {({ isSubmitting }) => (
                        <Form className="space-y-6">
                          <TextInput
                          name={"email"}
                          label={"Email Address"}
                          />
                          <div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {isSubmitting? 
                              <>
                              <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                              </> 
                              : 
                              <>Submit</>}
                            </button>
                          </div>
                        </Form>
                        )}
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

SignIn.getLayout = getLayout;

SignIn.pageName = pages.auth.signIn.name
SignIn.pageCategory = pages.auth.signIn.category