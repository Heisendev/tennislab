export const requireAuth = (req, res, next) => {
    console.log("REQ SESSION", req.session);
    if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
