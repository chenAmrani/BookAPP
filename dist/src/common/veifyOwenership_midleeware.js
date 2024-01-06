"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyOwnership = (req, res, next) => {
    const { user } = req;
    if (!user) {
        return res.sendStatus(401);
    }
    if (user._id !== req.params.userId) {
        return res.sendStatus(403); // Forbidden - User does not own the content
    }
    next();
};
exports.default = verifyOwnership;
//# sourceMappingURL=veifyOwenership_midleeware.js.map