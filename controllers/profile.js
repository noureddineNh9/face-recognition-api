const handleProfile = (req, res, db) => {
   const { id } = req.params;
   db.select("*")
      .from("users")
      .where({ id })
      .then((user) => {
         if (user.length) {
            res.json(user[0]);
         } else {
            res.status(400).json("Not found");
         }
      })
      .catch((err) => res.status(400).json("error getting user"));
};

const update = (req, res, db) => {
   const { id } = req.params;
   const { name, age } = req.body;

   db("users")
      .where({ id })
      .update({ name })
      .then((resp) => {
         if (resp) {
            res.status(200).json("success");
         } else {
            res.status(400).json("error");
         }
      })
      .catch((err) => {
         res.status(400).json("error");
      });
};

module.exports = {
   handleProfile,
   update,
};
