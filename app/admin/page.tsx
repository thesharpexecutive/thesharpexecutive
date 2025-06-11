import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to the dashboard by default
  redirect('/admin/dashboard')
  
  // This return statement is needed for TypeScript, but will never be reached
  return null
}
