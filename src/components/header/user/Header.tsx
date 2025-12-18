import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/auth/useLogout";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { saveLastVisitedPath } from "@/store/slices/navigationSlice";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { mutate: logoutUserFn } = useLogout("user");

    const user = useSelector((state: RootState) => state.user.user?.id);
    const profileImage = useSelector(
        (state: RootState) => state.user.user?.profileImage
    );
    const userName = useSelector(
        (state: RootState) => state.user.user?.firstName
    );

    const handleLogout = () => {
        logoutUserFn();
    };

    return (
        <header className='w-full bg-white shadow-sm relative'>
            <div className="py-3 px-7 flex items-center justify-between">
                {/* Title and Nav*/}
                <div className="flex w-1/3 justify-between">
                    <h1 className='text-[23px] font-medium tracking-tight'>
                        Travesta
                    </h1>

                    <div className="hidden md:flex items-center gap-10">
                        <Link to='/user/home' className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                            Home
                        </Link>
                        <Link to='/user/subscription' className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                            Subscriptions
                        </Link>

                        <Link to="/user/about-us" className="text-xs font-semibold hover:underline hover:underline-offset-4 cursor-pointer">
                            About Us
                        </Link>
                    </div>

                </div>

                {/* User Section */}
                {user ? (
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/user/profile">
                            <Avatar className="cursor-pointer w-8 h-8">
                                <AvatarImage src={profileImage} alt="User" />
                                <AvatarFallback>
                                    {userName?.charAt(0).toUpperCase() || "N"}
                                </AvatarFallback>
                            </Avatar>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="text-xs font-semibold hover:underline hover:underline-offset-4"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            dispatch(
                                saveLastVisitedPath(
                                    window.location.pathname +
                                    window.location.search
                                )
                            );
                            navigate("/user/login");
                        }}
                        className="text-xs font-semibold hover:underline hover:underline-offset-4"
                    >
                        Login or Create Account
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
