
// Middleware för att kolla is_admin= true i JWT-token
function requireAdmin(req, res, next) {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({
            message: "Åtkomst nekad"
        });
    }
    next();
}

module.exports = requireAdmin;