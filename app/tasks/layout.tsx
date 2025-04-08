import ProtectedLayout from '@/app/components/layouts/ProtectedLayout'

export default function TasksLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  )
}