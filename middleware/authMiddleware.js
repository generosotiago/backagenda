const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Pega o token do cabeçalho Authorization
    console.log('Token recebido:', token); 

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    try {
        const decoded = verifyToken(token); 

        if (!decoded) {
            return res.status(401).json({ message: "Token inválido ou expirado." });
        }
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        req.name = decoded.name;    
        req.phone = decoded.phone;  

        next(); 
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        return res.status(401).json({ message: "Token inválido.", error: err.message });
    }
};

module.exports = authMiddleware;
