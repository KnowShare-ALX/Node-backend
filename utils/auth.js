require('dotenv').config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

export default class AuthHandler {
    static generateAcessToken(userDetails) { //userDetails should be an object {email}
        return jwt.sign(
            userDetails,
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );
    }
}