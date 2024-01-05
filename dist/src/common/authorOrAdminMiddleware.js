"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorOrAdminMiddleware = (req, res, next) => {
    const { user } = req;
    if (!user || (user.role !== 'author' && user.role !== 'admin')) {
        return res.sendStatus(403); // Forbidden if not author or admin
    }
    next();
};
exports.default = authorOrAdminMiddleware;
//# sourceMappingURL=authorOrAdminMiddleware.js.map