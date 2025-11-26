import Image from "next/image";
import {requireAuth} from "@/app/lib/auth";
import {logout} from "@/app/actions/auth";
import ContentList from "@/app/ui/content-list";

export default async function Home() {
  const session = await requireAuth()

  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="w-full max-w-4xl p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              Dashboard
            </h1>
            <form action={logout}>
              <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
          <ContentList />
        </div>
      </div>
  )
}
