'use client'

import { useSocket } from '../lib/socket'

interface SocketProviderProps {
    token: string
}

export function SocketProvider({ token }: SocketProviderProps) {
    useSocket(token)
    return null
}

