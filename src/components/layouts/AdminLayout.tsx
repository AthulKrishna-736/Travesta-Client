import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "../sidebar/AdminSidebar"
import React from "react"
import { AdminLayoutProps } from "@/types/component.types"
import Header from "../header/admin/Header"

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
