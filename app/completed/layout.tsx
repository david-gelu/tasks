import ProtectedLayout from '@/app/components/layouts/ProtectedLayout'

export default function CompletedLayout({
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