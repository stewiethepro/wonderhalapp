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
    
    const userIdsToCheck = Object.values(userRequest)
    console.log('userIdsToCheck: ', userIdsToCheck)

    const checkUser = async (userId) => {
        let userExists = false
        let userEmail = null
        let id = null
        let userStatus = null
        let userLastName = null
        let userResidentGroup = null
    
        const { data: resident_group_member, error } = await serviceSupabase
            .from("resident_group_members")
            .select('*')
            .eq('user_id', userId)
        
            if (error) {
            console.log("Supabase error:", error)
            return error
            } else {
                if (resident_group_member.length === 0) {
                    console.log("no resident_group_member");
                } else {
                    console.log("resident_group_member found");
                    userExists = true
                    userEmail = resident_group_member[0].email
                    id = resident_group_member[0].id
                    userStatus = resident_group_member[0].status
                    userLastName = resident_group_member[0].last_name
                    userResidentGroup = resident_group_member[0].resident_group_id
                }
            const result = {id: id, email: userEmail, userId: userId, userExists: userExists, userStatus: userStatus, lastName: userLastName, userResidentGroup: userResidentGroup}
            console.log("resident_group_member: ", resident_group_member);
            console.log("result: ", result);
            return result
            }
    }
    
    const checkIds = async(userIdsToCheck) => {
        const ids = userIdsToCheck;
        console.log('for loop started');
        for (let id of ids) {
            console.log("check user inside for loop started");
            const result = await checkUser(id);
            userResult.push(result)
            console.log("check user inside for loop returned");
        }
        console.log('for loop finished');
        console.log("finalResult:", userResult);
        return userResult;
    }

    try {
        const data = await checkIds(userIdsToCheck)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error: error, message: error.message})
    }
        
}

export default handler;