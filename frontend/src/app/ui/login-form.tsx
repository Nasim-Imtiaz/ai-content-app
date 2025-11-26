'use client'

import { login } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function LoginForm() {
    const [state, action, pending] = useActionState(login, undefined)

    return (
        <form action={action} className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {state?.errors?.email && (
                    <p className="text-sm text-red-600">{state.errors.email[0]}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {state?.errors?.password && (
                    <p className="text-sm text-red-600">{state.errors.password[0]}</p>
                )}
            </div>

            {state?.message && (
                <p
                    className={`text-sm ${
                        state.message.includes('successful')
                            ? 'text-green-600'
                            : 'text-red-600'
                    }`}
                >
                    {state.message}
                </p>
            )}

            <button
                type="submit"
                disabled={pending}
                className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {pending ? 'Logging in...' : 'Log In'}
            </button>
        </form>
    )
}