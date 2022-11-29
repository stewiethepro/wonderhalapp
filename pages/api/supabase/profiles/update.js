import { getServiceSupabase } from "@/utils/supabase";

const serviceSupabase = getServiceSupabase()

const handler = async (req, res) => {
    const host = req.headers.host;
    const request = req.body
    const userResult = []
    
    
    // error handling
    
    // if (host != 'dev.stayhamlet.com') {
    //    return res.status(404).json({ error: "401 Unauthorized - client failed to authenticate with the server" });
    // }
    
    if (Object.values(req.body).length === 0) {
        return res.status(404).json({ error: "400 Invalid - invalid request, no body" });
    } 

    console.log('request on server: ', 
        request
    )

    const requestKeys = Object.keys(request)
    const requestValues = Object.values(request)

    let requestArray = requestValues.map((value, index) => {
        value.id = requestKeys[index]
        console.log("value: ", value)
        return value  
    })

    const updateUser = async (user_id, payload) => {
    
        const { data: profile, error } = await serviceSupabase
            .from("profiles")
            .update(payload)
            .eq('id', user_id)
            .select()
        
            if (error) {
            console.log("Supabase error:", error)
            return error
            } else {
            console.log("profile: ", profile);
            return profile
            }
    }
    
    const updateUsers = async(requestArray) => {
        const users = requestArray;
        console.log('for loop started');
        for (let user of users) {
            console.log("update user inside for loop started");
            const result = await updateUser(user.id, user.payload);
            userResult.push(result)
            console.log("check user inside for loop returned");
        }
        console.log('for loop finished');
        console.log("finalResult:", userResult);
        return userResult;
    }

    try {
        const data = await updateUsers(requestArray)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error: error, message: error.message})
    }
        
}

export default handler;