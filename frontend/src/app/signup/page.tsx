import SignupForm from '@/app/ui/signup-form'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6 text-black dark:text-zinc-50">
                    Create an Account
                </h1>
                <SignupForm />
            </div>
        </div>
    )
}