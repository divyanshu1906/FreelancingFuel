export const verifyClient = (req, res, next) => {
    if(req.user.role !== 'client'){
        return res.status(403).json({ message: "Access denied. Clients only." });
    }
    next();
};

export const verifyFreelancer = (req, res, next) => {
    if(req.user.role !== 'freelancer'){
        return res.status(403).json({ message: "Access denied. Freelancers only." });
    }
    next();
};