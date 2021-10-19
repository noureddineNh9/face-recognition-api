const clarifai = require("clarifai")

const app = new Clarifai.App({
    apiKey: '96a89d56babb40cb8fbbfbd08f2a7481'
})
  
const handleImageurl = (req, res) => {
    app.models
        .predict('a403429f2ddf4b49b307e318f00e528b',req.body.input)
        .then(data => res.json(data))
}

const handleImage = (req, res, con) => {
    const { id } = req.body

    const sql = `UPDATE users SET entries=entries+1 where id=${id}`
    con.query(sql, (err, result) => {
        if (err) {
            res.status(400).json("something wrong")
        }

        con.query(`select entries from users where id=${id}`, (err, result) => {
            if (err) {
                res.status(400).json("something wrong")
            }
            const data = JSON.parse(JSON.stringify(result));
            res.send(data[0])

        })


    })

}

module.exports = {
    handleImage: handleImage,
    handleImageurl: handleImageurl
}