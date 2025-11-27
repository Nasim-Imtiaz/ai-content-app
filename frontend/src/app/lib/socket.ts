'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useContentStore } from '../store/contentStore'

export function useSocket(token: string | null) {
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!token) {
            return
        }

        let socketUrl = process.env.NEXT_WS_URL || 'http://localhost:4000'
        
        const socket = io(socketUrl, {
            auth: {
                token: token
            },
            query: {
                token: token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000,
            forceNew: false,
            withCredentials: true,
            upgrade: true,
            rememberUpgrade: false
        })
        
        console.log('Socket instance created, token sent in auth and query')

        socket.on('authenticated', (data) => {
            console.log('✅ Socket authenticated:', data)
        })

        socketRef.current = socket

        socket.on('jobUpdate', (content: any) => {
            console.log('Received content update:', content)

            if (content._id) {
                const state = useContentStore.getState()
                const existingContent = state.contents.find(
                    (c) => String(c._id) === String(content._id)
                )
                
                if (existingContent) {
                    state.updateContent(content._id, content)
                } else {
                    state.addContent(content)
                }
            }
        })

        socket.on('connect_error', (error: Error & { type?: string; description?: any }) => {
            console.error('Socket connection error:', error)
            console.error('Error details:', {
                message: error.message,
                type: error.type || 'unknown',
                description: error.description || 'no description'
            })
        })

        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        return () => {
            socket.disconnect()
        }
    }, [token])

    return socketRef.current
}

