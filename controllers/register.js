const handleRegister = async (req, res, con, bcrypt, getUser) => {
    const {email, name, password} = req.body;
    let exist = false;
    let currentUser ;

    if (!email || !password || !name) {
        return res.status(400).json("incorrect form submission")
    }

    await getUser(email)
        .then((result) => {
            if (result != null) {
                exist = true
            }
        })
        .catch(console.log())

    if (!exist) {
        bcrypt.hash(password, null, null, (err, hash) => {
            const sql = `INSERT INTO login(email, hash) values('${email}','${hash}')`;
            con.query(sql, (err, result) => {
                if (err) {
                    res.status(400).json("something wrong")
                }
                const sql2 = `INSERT INTO users(name, email, joined) values('${name}','${email}','${new Date().toISOString().split('.')[0]}')`
                con.query(sql2, async (err, result) => {
                    if (err) {
                        res.status(400).json("something wrong")
                    }
                    // return user Info
                    await getUser(email)
                    .then((result) => {
                        if (result != null) {
                            currentUser = result
                        }
                    })
                    return res.json(currentUser);
                })
            })
        })
    }else{
        res.status(400).json('User exist')

    }
}

module.exports = {
    handleRegister: handleRegister
}