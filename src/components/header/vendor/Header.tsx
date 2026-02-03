import { Menu, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/auth/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface HeaderProps {
    toggleSidebar: () => void;
    sidebarOpen: boolean;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const { mutate: logoutVendor } = useLogout('vendor');

    const handleLogout = () => {
        logoutVendor();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 fixed top-0 w-full z-10">
            <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 sm:mr-4">
                    <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg sm:text-xl font-bold text-travesta-700">
                    Travesta
                    <span className="hidden sm:inline text-sm font-normal text-gray-500 ml-2">Vendor Portal</span>
                </h1>
            </div>

            <div className="flex items-center space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.profileImage} />
                                <AvatarFallback>{user?.firstName?.charAt(0) || 'User'}</AvatarFallback>
                            </Avatar>

                            {/* Show name and role only on sm and above */}
                            <div className="hidden sm:flex flex-col items-start text-sm">
                                <span className="font-medium">Hello, {user?.firstName}</span>
                                <span className="text-xs text-muted-foreground">Hotel Manager</span>
                            </div>

                            <ChevronDown className="hidden sm:block h-4 w-4 ml-1 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/vendor/profile')}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
