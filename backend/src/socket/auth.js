import jwt from "jsonwebtoken";

export function authenticateSocket(socket) {
    const token = socket.handshake.auth?.token || 
                  socket.handshake.query?.token ||
                  socket.handshake.headers?.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return { success: false, error: "No token provided" };
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "OPTIMIZELYTOKEN");
        return { success: true, userId: decoded.id };
    } catch (err) {
        return { success: false, error: "Invalid token" };
    }
}

