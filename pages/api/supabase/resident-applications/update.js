import { getServiceSupabase } from "@/utils/supabase";

const serviceSupabase = getServiceSupabase()

const handler = async (req, res) => {
    const host = req.headers.host;
    const request = req.body
    const residentApplicationResult = []
    
    
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

    const updateResidentApplication = async (user_id, payload) => {
    
        const { data, error } = await serviceSupabase
            .from("resident_applications")
            .update(payload)
            .eq('user_id', user_id)
            .select()
        
            if (error) {
            console.log("Supabase error:", error)
            return error
            } else {
            console.log("Resident application updated: ", data);
            return data
            }
    }
    
    const updateResidentApplications = async(requestArray) => {
        const residents = requestArray;
        console.log('for loop started');
        for (let resident of residents) {
            console.log("update resident application inside for loop started");
            const result = await updateResidentApplication(resident.id, resident.payload);
            residentApplicationResult.push(result)
            console.log("check resident application inside for loop returned");
        }
        console.log('for loop finished');
        console.log("finalResult:", residentApplicationResult);
        return residentApplicationResult;
    }

    try {
        const data = await updateResidentApplications(requestArray)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error: error, message: error.message})
    }

}

export default handler;