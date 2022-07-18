const redisClient = require("../controllers/signin").redisClient;

const requireAuth = async (req, res, next) => {
   const { authorization } = req.headers;

   if (!authorization) {
      return res.status(401).json("Unauthorized");
   }

   try {
      if (!redisClient.isOpen) await redisClient.connect();

      const userId = await redisClient.get(authorization);
      if (userId) {
         return next();
      }
      throw Error;
   } catch (err) {
      return res.status(401).json("Unauthorized");
   }
};

module.exports = {
   requireAuth,
};
