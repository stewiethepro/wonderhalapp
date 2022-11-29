import { AkahuClient } from 'akahu';

// Replace appToken with your App Token
const appToken = 'app_token_clavh3qsg000108mtewhc26rn';
// Replace with an OAuth user access token. See note below for details.
const userToken = 'user_token_clavh3qsg000208mta17o4vgk';

// Create an instance of the AkahuClient and fetch some information
const akahu = new AkahuClient({ appToken });

export async function getAccounts() {
    return new Promise(resolve => {
        (async () => {
        try {
            const user = await akahu.users.get(userToken);
            const accounts = await akahu.accounts.list(userToken);

            // Let's have a look at what we got back
            console.log(`${user.email} has linked ${accounts.length} accounts:`);

            for (const account of accounts) {
            const { connection, name, formatted_account, balance } = account;

            console.log(`  ${connection.name} account "${name}" (${formatted_account}) ` +
                        `with available balance $${balance.available}.`);
            }

            resolve({user, accounts})
        } catch (error) {
            console.log("error: ", error);
            resolve(error)
        }
        })()
    })
}