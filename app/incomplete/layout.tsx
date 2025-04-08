import ProtectedLayout from '@/app/components/layouts/ProtectedLayout'

export default function IncompleteLayout({
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