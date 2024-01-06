"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom middleware to check for author or admin role
const authorOrAdminMiddleware = (req, res, next) => {
    const { user } = req;
    if (!user || (user.role !== 'author' && user.role !== 'admin')) {
        return res.sendStatus(403); // Forbidden if not author or admin
    }
    next();
};
exports.default = authorOrAdminMiddleware;
//# sourceMappingURL=authorOrAdmin_middleware.js.map