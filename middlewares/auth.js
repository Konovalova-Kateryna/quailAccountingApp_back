const admin = require("../config/firebase");
const { User } = require("../schemas/users");
const { HttpError } = require("../utils");

const auth = async (req, res, next) => {
    try{

        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
          return res.status(401).json({ message: "No token provided" });
        }
        const token = header.split(" ")[1];
      
        // Перевіряємо Firebase токен
        const decoded = await admin.auth().verifyIdToken(token);
      
        // шукаємо користувача в базі Монго
        let user = await User.findOne({ firebaseUid: decoded.uid });
      
        // якщо перший вхід, створюємо користувача
        if (!user) {
          user = await User.create({
            name: decoded.name || "Unnamed",
            email: decoded.email,
            firebaseUid: decoded.uid,
            role: "user",
          });
          console.log(`Created new user:${user.name}`);
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log("Auth error:", error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = auth;



// При запиті на логінізацію в firebase в Постмені в боді обов'язково додавати поле "returnSecureToken": true, інакше токен не буде виданий, і авторизація не працюватиме.