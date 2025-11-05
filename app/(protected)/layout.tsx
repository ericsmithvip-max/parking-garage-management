import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/server'
import { Sidebar } from './Sidebar'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar userEmail={user.email || ''} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
