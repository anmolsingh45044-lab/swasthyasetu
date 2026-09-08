// Admin-only gate. Relies exclusively on req.user.role, which authMiddleware
// populated fresh from MongoDB on this request. There is no code path by
// which a client-supplied value (body, header, query param) can influence
// this check - admin status can only ever be changed directly in the database.
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

module.exports = { requireAdmin };
