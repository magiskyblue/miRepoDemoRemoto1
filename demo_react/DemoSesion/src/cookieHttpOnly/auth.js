export default function auth (req, res, next){
    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({message:"No autentificado"})
    }

    try {
        const decoded = jwt.verify(token, SECRET); 
        req.user = decoded; 
        next();
    } catch {
        return res.status(401).json ({message:"Token no valido"})
    }
}