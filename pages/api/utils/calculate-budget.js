const handler = async (req, res) => {
    const host = req.headers.host;
    const {income, savings} = req.query

    // error handling
    
    // if (host != 'dev.stayhamlet.com') {
    //    return res.status(404).json({ error: "401 Unauthorized - client failed to authenticate with the server" });
    // }
    
    if (Object.values(req.query).length === 0) {
        return res.status(404).json({ error: "400 Invalid - invalid request, no query" });
    } 

    console.log('userRequest on server: ', 
    "income: ", income,
    "savings: ", savings,
    )

    // Calculate median income

    let newIncome = income
    .replace(/\$/g,'')
    .replace(/,/g,'')
    .split(' - ')
 
    let minIncome = parseInt(newIncome[0], 10)
    let maxIncome = parseInt(newIncome[1], 10)
    let medianIncome = (minIncome + maxIncome) / 2
 
    // Check if user has savings, 
    // Calculate median savings

    function calculateSavings(savings){
        if ((savings === "" || savings === "None")) {
            let medianSavings = 0
            return medianSavings
        } else {
            let newSavings = savings
            .replace(/\$/g,'')
            .replace(/,/g,'')
            .split(' - ')
            
            let minSavings = parseInt(newSavings[0], 10)
            let maxSavings = parseInt(newSavings[1], 10)
            let medianSavings = (minSavings + maxSavings) / 2
            return medianSavings
        }
    }

    const medianSavings = calculateSavings(savings)
    console.log("medianSavings: ", medianSavings);

    // Define NZ tax brackets
    
    const tax1=14000*0.105; //14000x10.5%
    const tax2=tax1+(48000-14000)*0.175; //7420
    const tax3=tax2+(70000-48000)*0.3;
    const tax4=tax3+(180000-70000)*0.33;

    // Calculate income tax

    function calculateTax(medianIncome){
        let tax = 0;

        if(medianIncome <= 14000)
            tax = medianIncome * 0.105;
        else if(medianIncome > 14000 && medianIncome <= 48000)
            tax = tax1 + (medianIncome - 14000) * 0.175;
        else if(medianIncome > 48000 && medianIncome <= 70000)
            tax = tax2 + (medianIncome - 48000) * 0.30;
        else if(medianIncome > 70000 && medianIncome <= 180000)
            tax = tax3 + (medianIncome - 70000) * 0.33;
        else if(medianIncome > 180000)
            tax = tax4 + (medianIncome - 180000) * 0.39;
        else{
            alert("Input is invalid, please retry!");
            return;
        }
        let incomeAfterTax = medianIncome - tax 
        console.log("tax: ", tax);
        console.log("incomeAfterTax: ", incomeAfterTax);
        return {tax, incomeAfterTax};
    }

    function calculateBudget(medianIncome, medianSavings){
        const {tax, incomeAfterTax} = calculateTax(medianIncome)

        let exactBudget = ((incomeAfterTax / 52) * 0.33) + ((medianSavings / 52) * 0.1)
        let budget = Math.round(exactBudget / 10) * 10
        
        let result = {
            "medianIncome": medianIncome,
            "incomeAfterTax": incomeAfterTax,
            "medianSavings": medianSavings,
            "budget": budget,
        }
        
        console.log("result: ", result);

        return result
    }

    const result = calculateBudget(medianIncome, medianSavings)

    res.send(JSON.stringify(result))
        
}

export default handler;