"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorMiddleware = (req, res, next) => {
    const { user } = req;
    if (!user || (user.role !== 'author' && user.role !== 'admin')) {
        return res.sendStatus(403); // Forbidden if not author or admin
    }
    next();
};
exports.default = authorMiddleware;
//# sourceMappingURL=author_middleware.js.map