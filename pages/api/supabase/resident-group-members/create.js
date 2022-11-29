import { getServiceSupabase } from "@/utils/supabase";

const serviceSupabase = getServiceSupabase()

const handler = async (req, res) => {
    const host = req.headers.host;
    const {primaryResidentGroupMember, invitedFlatmates} = req.body

    const payload = Object.values(primaryResidentGroupMember).length === 0? [] : [primaryResidentGroupMember]

    invitedFlatmates.map((flatmate) => payload.push(flatmate))
    console.log(payload);
    
    // error handling
    
    // if (host != 'dev.stayhamlet.com') {
    //    return res.status(404).json({ error: "401 Unauthorized - client failed to authenticate with the server" });
    // }
    
    if (Object.values(req.body).length === 0) {
        return res.status(404).json({ error: "400 Invalid - invalid request, no body" });
    } 

    console.log('userRequest on server: ', 
    'payload: ', payload
    )

    try {
        const { data, error } = await serviceSupabase
        .from("resident_group_members")
        .insert(payload)
        .select()
    
        if (error) {
            console.log("Supabase error:", error)
            res.status(500).json(data)
        } else {
            console.log("residentGroupMembers updated: ", data)
            res.status(200).json(data)
        }   
    } catch (error) {
        res.status(500).json({error: error, message: error.message})
    }
        
}

export default handler;