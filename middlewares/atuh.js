const jwt = require("jsonwebtoken"); //call to jwt token
const { config } = require("../config/secret");


exports.auth = (req, res, next) => {
    // Token sending test
    let token = req.header("auth-token"); //get token from request
    if (!token) {
        return res.status(401).json({ err_msg: "need to send token to his endpoint url" })
    }
    try {
        // Checks if the token is valid or legitimate
        let decodeToken = jwt.verify(token, `${config.tokenSecret}`);
       
        req.tokenData = decodeToken; // Produces a property within the (req) parameter that is the same In everyone
        // Next -> says the function has finished its function and can be passed
         //To the next function in the router
        next()
    } catch (err) {
        return res.status(401).json({ err_msg: "Token invalid or expired" })
    }
}