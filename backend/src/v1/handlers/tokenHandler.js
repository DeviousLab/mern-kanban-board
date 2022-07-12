const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenDecode = (req) => {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(bearer, process.env.JWT_SECRET_KEY);
      return decoded;
    } catch {
      return false;
    }
  } else {
    return false;
  }
}

exports.verifyToken = async (req, res, next) => {
  const decoded = tokenDecode(req);
  if (decoded) {
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json('Unauthorized');
    }
    req.user = user;
    next();
  } else {
    res.status(401).json('Unauthorized');
  }
}