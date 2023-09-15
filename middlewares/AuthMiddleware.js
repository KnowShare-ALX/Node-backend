function isAuthenticated(req, res, next) {
    // Check if the user is authenticated (e.g., through Passport.js)
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware
    } else {
      return res.status(401).json({ error: 'Unauthorized' }); // User is not authenticated, send a 401 Unauthorized response
    }
}

export default isAuthenticated;
