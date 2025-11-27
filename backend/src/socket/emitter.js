export function createEmitFunction(io, userSockets) {
    return function emitJobUpdateToUser(userId, payload) {
        const sockets = userSockets.get(userId);
        if (!sockets) return;
        
        for (const socketId of sockets) {
            io.to(socketId).emit("jobUpdate", payload);
        }
    };
}

