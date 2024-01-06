"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminMiddleware = (req, res, next) => {
    const { user } = req;
    if (!user || (user.role !== 'admin')) {
        return res.sendStatus(403); // Forbidden if not author or admin
    }
    next();
};
exports.default = AdminMiddleware;
//# sourceMappingURL=admin_middleware.js.map