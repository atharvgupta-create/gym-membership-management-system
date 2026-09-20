// middleware/authMiddleware.js
// This middleware protects private routes by verifying the JWT token.
// Any route that requires the admin to be logged in will use this middleware.

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get the token from the Authorization header
  //    The format sent by the frontend is: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // 2. Extract just the token part (after "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using our JWT_SECRET from .env
    //    If the token is invalid or expired, jwt.verify() will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded admin info to the request object
    //    so it's available in the actual route handler
    req.admin = decoded;

    // 5. Call next() to pass control to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
