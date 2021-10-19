const handleSignin = async (req, res, con, bcrypt, getUser) => {
    const {email, password} = req.body;

    let currentUser ;
    var error = '';

    
    if (!email || !password ) {
        return res.status(400).json("incorrect form submission")
    }

    const sql = `SELECT email, hash FROM login where email='${email}'`
    con.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        const data = JSON.parse(JSON.stringify(result));
        console.log(result);
        
        if(data.length != 0)
        {
            const hash = data[0].hash
            bcrypt.compare(password, hash, async (err, isValid) => {
                if(err){
                    throw err
                }
    
                if(isValid){
                    await getUser(email)
                    .then((result) => {
                        if (result != null) {
                            currentUser = result
                        }
                    })
                    return res.json(currentUser);
                }else{
                    res.status(400).json("Invalid passsword")
                }
            })
        }else{
            res.status(400).json("User not found")
        }
    })
    if(error != '')
        res.status(400).json(error)

} 

module.exports = {
    handleSignin: handleSignin
}