import { getServiceSupabase } from "@/utils/supabase";

const serviceSupabase = getServiceSupabase()

const handler = async (req, res) => {
    const host = req.headers.host;
    const {user_id} = req.body
    
    // error handling
    
    // if (host != 'dev.stayhamlet.com') {
    //    return res.status(404).json({ error: "401 Unauthorized - client failed to authenticate with the server" });
    // }
    
    if (Object.values(req.body).length === 0) {
        return res.status(404).json({ error: "400 Invalid - invalid request, no query" });
    } 

    console.log('userRequest on server: ', 
    'user_id: ', user_id, 
    )

    try {

        const { data, error } = await serviceSupabase
        .from("resident_groups")
        .insert([{ created_by: user_id }])
    
        if (error) {
            console.log("Supabase error:", error)
            res.status(500).json(data)
        } else {
            console.log("residentGroup created: ", data)
            res.status(200).json(data)
        }  
    } catch (error) {
        res.status(500).json({error: error, message: error.message})
    }
        
}

export default handler;