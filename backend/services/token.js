const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_ACCESS_SECRET } = process.env;

class TokenService {
  static validateAccessToken(token) {
    return jwt.verify(token, NODE_ENV === 'production' ? JWT_ACCESS_SECRET : '123');
  }

  static generateToken(payload) {
    const accessToken = jwt.sign(payload, NODE_ENV === 'production' ? JWT_ACCESS_SECRET : '123', {
      expiresIn: '7d',
    });

    return accessToken;
  }
}

module.exports = TokenService;
