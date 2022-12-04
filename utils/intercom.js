import crypto from 'crypto'
import { get } from '@/utils/api/request';

const secret = process.env.INTERCOM_SECRET

export function createIntercomSignature(userId) {
    
    // Calling createHmac method
    const hash = crypto.createHmac('sha256', secret)
                    
    // updating data
    .update(userId)

    // Encoding to be used
    .digest('hex');
 
    return hash

}

export async function getIntercomSignature(request) {
    return new Promise(resolve => {
      (async () => {
        try {
            await get('/api/intercom/create-signature', request).then((result) => {
                const data = result;
                resolve(data);
            })
        } catch (error) {
            console.log("API error: ", error);
            resolve(error);
        }
      })()
    })
  }

  export async function updateIntercom(user, profile, update) {

    let userId = ""
    let email = ""
    let name = ""

    return new Promise(resolve => {
      (async () => {
        try {

            if (user) {
                userId = user.id
                email = user.email
                name = profile.first_name + " " + profile.last_name

                const hash = await getIntercomSignature({userId: userId});

                console.log("hash: ", hash);
                console.log("userId:", userId);
                console.log("userEmail:", email);
                console.log("name", name);

                update({
                    userId: userId,
                    email: email, 
                    name: name,
                    userHash: hash
                })

            } else {
                update() 
            }

          console.log("intercom updated");

          resolve("intercom updated")

        } catch (error) {
            console.log("error: ", error);
            resolve(error)
        }
      })();
    })
}