'use server'

import {SignupFormSchema, FormState, LoginFormSchema, LoginFormState} from '@/app/lib/definitions'
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

export async function signup(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, password } = validatedFields.data

    try {
        console.log(process.env.NEXT_PUBLIC_API_URL);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
                message: errorData.message || 'Failed to create user. Please try again.',
            }
        }

    } catch (error) {
        console.error('Signup error:', error)
        return {
            message: 'An error occurred. Please try again later.',
        }
    }

    redirect('/login')
}

export async function login(
    state: LoginFormState,
    formData: FormData
): Promise<LoginFormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
                message: errorData.message || 'Invalid email or password. Please try again.',
            }
        }

        const userData = await response.json()

        const accessToken = userData.token

        if (!accessToken) {
            return {
                message: 'Login failed: No access token received.',
            }
        }

        // Save access token in cookie
        const cookieStore = await cookies()
        cookieStore.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })
    } catch (error) {
        console.error('Login error:', error)
        return {
            message: 'An error occurred. Please try again later.',
        }
    }

    redirect('/')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    redirect('/login')
}

