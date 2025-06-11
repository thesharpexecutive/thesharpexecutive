import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
import { redirect } from "next/navigation"

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions)
  return session?.user
}

export const requireAuth = async () => {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }
  return user
}

export const requireAdmin = async () => {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') {
    redirect('/admin/unauthorized')
  }
  return user
}
