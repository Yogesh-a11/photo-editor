import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) return res.status(401).json({ messsage: "Not authenticated"})
    
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ messsage: "Invalid Token"})
        }

        req.userId = payload.userId;

        next();
    });
};