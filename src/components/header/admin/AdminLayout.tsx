import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "../../sidebar/AdminSidebar"
import { useLogout } from "@/hooks/auth/useLogout"
import React from "react"
import { AdminLayoutProps } from "@/types/component.types"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"


export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const adminName = useSelector((state: RootState) => state.admin.admin?.firstName)
  const { mutate: logout } = useLogout('admin')

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6 bg-gray-200">
            <SidebarTrigger />
            <h1 className="text-lg sm:text-xl font-bold text-travesta-700">
              Travesta
              <span className="hidden sm:inline text-sm font-normal ml-2">Admin Portal</span>
            </h1>
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  </DropdownMenuTrigger>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                        <AvatarFallback>{adminName!.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
