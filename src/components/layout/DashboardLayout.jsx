import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function DashboardLayout({
  children,
  menuItems,
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <Sidebar menuItems={menuItems} />

      <main className="flex-1 ml-72">
        <Topbar />

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}