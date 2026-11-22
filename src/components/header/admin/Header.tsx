import { useSelector } from 'react-redux'
import { useLogout } from '@/hooks/auth/useLogout'
import { RootState } from '@/store/store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LogOut, ChevronDown } from 'lucide-react'

const Header = () => {
    const userName = useSelector((state: RootState) => state.user.user?.firstName);
    const { mutate: logout } = useLogout('admin')
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="rounded-lg text-gray-500 hover:bg-gray-100" />

                <div>
                    <h1 className="text-lg font-bold tracking-tight text-travesta-700">
                        Travesta
                    </h1>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        Admin Portal
                    </p>
                </div>
            </div>

            {/* Profile */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-10 gap-2 rounded-xl px-2 hover:bg-gray-100"
                    >
                        <Avatar className="h-8 w-8 border border-gray-200">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                                {userName?.charAt(0)?.toUpperCase() ?? 'A'}
                            </AvatarFallback>
                        </Avatar>

                        <span className="hidden sm:block text-sm font-medium text-gray-700">
                            {userName ?? 'Admin'}
                        </span>

                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-52 rounded-xl border-gray-100 p-2 shadow-lg"
                >
                    <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-sm font-semibold text-gray-800">
                            {userName ?? 'Admin'}
                        </p>
                        <p className="text-xs font-normal text-gray-400 mt-0.5">
                            Admin account
                        </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => logout()}
                        className="cursor-pointer rounded-lg px-3 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-600"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default Header