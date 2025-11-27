'use server'

import { cookies } from 'next/headers'

async function getAuthHeaders() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
        throw new Error('Not authenticated')
    }

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

export async function fetchContents() {
    try {
        const headers = await getAuthHeaders()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/content'

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers,
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error('Failed to fetch contents')
        }

        const data = await response.json()
        return { success: true, data }
    } catch (error) {
        console.error('Fetch contents error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch contents' }
    }
}

export async function createContent(content: { prompt: string; contentType: string; generatedText?: string; [key: string]: any }) {
    try {
        const headers = await getAuthHeaders()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/generate-content'

        const formData = {
            prompt: content.prompt,
            contentType: content.contentType
        }

        console.log(formData)

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(formData),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to create content')
        }

        const data = await response.json()
        return { success: true, data }
    } catch (error) {
        console.error('Create content error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to create content' }
    }
}

export async function updateContent(id: string | number, content: { title?: string; description?: string; [key: string]: any }) {
    try {
        const headers = await getAuthHeaders()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/content/${id}`

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers,
            body: JSON.stringify(content),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to update content')
        }

        const data = await response.json()
        return { success: true, data }
    } catch (error) {
        console.error('Update content error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update content' }
    }
}

export async function deleteContent(id: string | number) {
    try {
        console.log(id)
        const headers = await getAuthHeaders()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/content/${id}`

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to delete content')
        }

        return { success: true }
    } catch (error) {
        console.error('Delete content error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to delete content' }
    }
}

