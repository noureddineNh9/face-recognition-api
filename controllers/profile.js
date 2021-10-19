const handleProfile = (req, res, con) => {
    const {id} = req.params;
    let isFound = false

    const sql = `SELECT * FROM users where id=${id}`;
    con.query(sql, (err, result) => {
        if (err) {
            res.status(400).json("something wrong")
        }
        const data = JSON.parse(JSON.stringify(result));
        var result = null;
        if(data.length != 0){
            return res.json(data[0]);
        }else{
            res.status(400).json('user not found')
        }
    });

}

module.exports = {
    handleProfile: handleProfile
}