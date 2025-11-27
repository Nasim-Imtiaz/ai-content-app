let ioInstance = null;
let emitJobUpdateToUserFn = null;
let userSocketsMap = null;

export function setSocketIO(io) {
    ioInstance = io;
}

export function setEmitFunction(fn, userSockets) {
    emitJobUpdateToUserFn = fn;
    userSocketsMap = userSockets;
}

export function emitJobUpdateToUser(userId, payload) {
    if (emitJobUpdateToUserFn) {
        emitJobUpdateToUserFn(userId, payload);
    } else if (ioInstance && userSocketsMap) {
        const sockets = userSocketsMap.get(userId);
        if (!sockets) return;
        for (const socketId of sockets) {
            ioInstance.to(socketId).emit("jobUpdate", payload);
        }
    } else {
        console.warn("emitJobUpdateToUser called but socket.io not initialized");
    }
}
