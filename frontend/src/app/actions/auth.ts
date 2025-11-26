'use server'

import { SignupFormSchema, FormState } from '@/app/lib/definitions'

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

        return {
            message: 'User created successfully!',
        }
    } catch (error) {
        console.error('Signup error:', error)
        return {
            message: 'An error occurred. Please try again later.',
        }
    }
}

