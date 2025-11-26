import LoginForm from '@/app/ui/login-form'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6 text-black dark:text-zinc-50">
                    Log In
                </h1>
                <LoginForm />
                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <a
                        href="/signup"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}