import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')
    return token?.value || null
}

export async function verifySession() {
    const token = await getAccessToken()

    if (!token) {
        return null
    }

    return {
        token,
        isAuthenticated: true,
    }
}

export async function requireAuth() {
    const session = await verifySession()

    if (!session) {
        redirect('/login')
    }

    return session
}

