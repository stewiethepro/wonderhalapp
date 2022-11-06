import { getServiceSupabase } from "@/utils/supabase";

const serviceSupabase = getServiceSupabase()

const handler = async (req, res) => {
    const userResult = []
    const userRequest = req.query
    const host = req.headers.host;
    
    // error handling
    
    // if (host != 'dev.stayhamlet.com') {
    //    return res.status(404).json({ error: "401 Unauthorized - client failed to authenticate with the server" });
    // }
    
    if (Object.values(userRequest).length === 0) {
        return res.status(404).json({ error: "400 Invalid - invalid request, no query" });
    } 

    console.log('userRequest on server: ', userRequest)
    
    const emailsToCheck = Object.values(userRequest)
    console.log('emailsToCheck: ', emailsToCheck)

    const checkUser = async (email) => {
        let userExists = false
        let userId = null
        let userStatus = null
        let userLastName = null
        let userBudget = 0
    
        const { data: profile, error } = await serviceSupabase
            .from("profiles")
            .select('*')
            .eq('email', email)
        
            if (error) {
            console.log("Supabase error:", error)
            return error
            } else {
                if (profile.length === 0) {
                    console.log("no profile");
                } else {
                    console.log("profile found");
                    userExists = true
                    userId = profile[0].id
                    userStatus = profile[0].status
                    userLastName = profile[0].last_name
                    userBudget = profile[0].budget
                }
            const result = {email: email, userExists: userExists, userId: userId, userStatus: userStatus, lastName: userLastName, budget: userBudget}
            console.log("profile: ", profile);
            console.log("result: ", result);
            return result
            }
    }
    
    const checkEmails = async(emailsToCheck) => {
        const emails = emailsToCheck;
        console.log('for loop started');
        for (let email of emails) {
            console.log("check user inside for loop started");
            const result = await checkUser(email);
            userResult.push(result)
            console.log("check user inside for loop returned");
        }
        console.log('for loop finished');
        console.log("finalResult:", userResult);
        return userResult;
    }

    try {
        const data = await checkEmails(emailsToCheck)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error: error, message: error.message})
    }
        
}

export default handler;