import { authenticateSocket } from './auth.js';

export function setupSocketHandlers(io, userSockets) {
    return (socket) => {
        console.log("Socket connection attempt:", socket.id);

        const authResult = authenticateSocket(socket);
        
        if (!authResult.success) {
            console.log("Socket connection rejected:", authResult.error);
            socket.emit("auth_error", { message: authResult.error });
            socket.disconnect();
            return;
        }

        const userId = authResult.userId;
        socket.userId = userId;
        console.log("Socket authenticated for user:", userId);

        // Add to user sockets map
        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);
        console.log("Socket connected:", socket.id, "for user", userId);

        socket.emit("authenticated", { userId });

        // Setup disconnect handler
        socket.on("disconnect", (reason) => {
            handleDisconnect(socket, userSockets, reason);
        });

        // Setup error handler
        socket.on("error", (error) => {
            console.error("Socket error for user", userId, ":", error);
        });
    };
}

function handleDisconnect(socket, userSockets, reason) {
    const userId = socket.userId;
    if (userId) {
        const set = userSockets.get(userId);
        if (set) {
            set.delete(socket.id);
            if (set.size === 0) {
                userSockets.delete(userId);
            }
        }
    }
    console.log("Socket disconnected:", socket.id, "reason:", reason);
}

