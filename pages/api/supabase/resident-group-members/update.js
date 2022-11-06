import { getServiceSupabase } from "@/utils/supabase";

const serviceSupabase = getServiceSupabase()

const handler = async (req, res) => {
    const host = req.headers.host;
    const {resident_group_id, resident_group_members_id, user_id, first_name, last_name, email, status} = req.body

    let payload = {
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        status: status,
    }
    
    // error handling
    
    // if (host != 'dev.stayhamlet.com') {
    //    return res.status(404).json({ error: "401 Unauthorized - client failed to authenticate with the server" });
    // }
    
    if (Object.values(req.body).length === 0) {
        return res.status(404).json({ error: "400 Invalid - invalid request, no body" });
    } 

    console.log('userRequest on server: ', 
    'resident_group_id: ', resident_group_id, 
    'resident_group_members_id: ', resident_group_members_id,
    'payload: ', payload
    )

    try {
        const { data, error} = await serviceSupabase
        .from("resident_group_members")
        .update(payload)
        .eq('id', resident_group_members_id)
        .eq('resident_group_id', resident_group_id)
    
        if (error) {
            console.log("Supabase error:", error)
            res.status(500).json(data)
        } else {
            console.log("residentGroupMember updated: ", data);
            res.status(200).json(data)
        }
    } catch (error) {
        res.status(500).json({error: error, message: error.message})
    }
        
}

export default handler;