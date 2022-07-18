const jwt = require("jsonwebtoken");
const { createClient } = require("redis");

const redisClient = createClient({ url: process.env.REDIS_URI });

// redisClient.on("error", (err) => {
//    console.log("redis error" + err);
// });

// redisClient.on("connect", (err) => {
//    console.log("connected to redis !!");
// });

const JWT_SECRET = "my_secret";

const handleSignin = async (req, res, db, bcrypt) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return Promise.reject("incorrect form submission");
   }
   return db
      .select("email", "hash")
      .from("login")
      .where("email", "=", email)
      .then((data) => {
         const isValid = bcrypt.compareSync(password, data[0].hash);
         if (isValid) {
            return db
               .select("*")
               .from("users")
               .where("email", "=", email)
               .then((user) => user[0])
               .catch((err) => Promise.reject("unable to get user"));
         } else {
            return Promise.reject("wrong credentials");
         }
      })
      .catch((err) => {
         console.log(err);
         return Promise.reject("wrong credentials");
      });
};

const generateToken = (email) => {
   const jwtPayload = { email };
   return jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "3 days" });
};

const createSession = async (user) => {
   const { email, id } = user;
   const token = generateToken(email);

   try {
      if (!redisClient.isOpen) await redisClient.connect();
      await redisClient.set(token, id);
      await redisClient.disconnect();
      return { seccess: "true", userId: id, token };
   } catch (err) {
      console.log(err);
   }
};

const getAuthTokenId = async (req, res) => {
   const { authorization } = req.headers;
   if (!redisClient.isOpen) await redisClient.connect();

   try {
      const userId = await redisClient.get(authorization);
      console.log("ok");
      if (userId) {
         return res.json({ id: userId });
      }
      throw Error;
   } catch (error) {
      console.log("no");

      return res.status(400).json("Unauthorized");
   }
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
   const { authorization } = req.headers;
   return authorization
      ? getAuthTokenId(req, res)
      : handleSignin(req, res, db, bcrypt)
           .then((data) => {
              return data.id && data.email
                 ? createSession(data)
                 : Promise.reject(data);
           })
           .then((session) => res.json(session))
           .catch((err) => res.status(400).json("error"));
};

module.exports = {
   handleSignin,
   signinAuthentication,
   redisClient,
};
