const jwt = require("jsonwebtoken");
const moment = require("moment/moment");




function createJWTTOKEN(user, expiryInHours = 6){
    const payload = {
        uid: user._id,
        iat: moment().unix(),
        exp: moment().add(expiryInHours, "hours").unix(),
        claims:{
            name: user.name,
            email:user.email,
        },
    };

// pormise is used for asyn tasks

let myPromise = new Promise((resolve, reject ) =>{
    jwt.sign(payload, process.env.JWT_ENCRYPTION_KEY, (err, token) =>{
        if(err)
            reject(err);
        else
            resolve(token);
    });
});

return myPromise;
}


const userTypes = {
    USER_TYPE_SUPER: 1,
    USER_TYPE__STANDARD: 2,
}

module.exports = {
    userTypes,
    createJWTTOKEN
};