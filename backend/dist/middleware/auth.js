"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_js_1 = require("../auth/jwt.js");
function authenticate(req, res, next) {
    try {
        let token = req.cookies?.accessToken;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({ error: 'Unauthorized. Authentication token required.' });
            return;
        }
        const decoded = (0, jwt_js_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    }
}
//# sourceMappingURL=auth.js.map