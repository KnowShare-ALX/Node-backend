const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default class AuthHandler {
  static generateAcessToken(userDetails) { //userDetails should be an object {email}
    return jwt.sign(
      userDetails,
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' }
    );
  }

  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
    };
  }
}