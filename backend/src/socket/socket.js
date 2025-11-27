let emitJobUpdateToUserFn = null;

export function setEmitFunction(fn) {
    emitJobUpdateToUserFn = fn;
}

export function emitJobUpdateToUser(userId, payload) {
    if (emitJobUpdateToUserFn) {
        emitJobUpdateToUserFn(userId, payload);
    } else {
        console.warn("emitJobUpdateToUser called but socket.io not initialized");
    }
}
