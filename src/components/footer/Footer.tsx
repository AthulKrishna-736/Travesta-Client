import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-blue-400">Travesta</h2>
                        <p className="text-gray-400 text-sm mt-2">Your Journey, Our Priority</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <a href="#" className="w-10 h-10 flex items-center justify-center border-2 border-gray-700 rounded-md hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center border-2 border-gray-700 rounded-md hover:border-pink-400 hover:bg-pink-400/10 transition-all duration-300">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center border-2 border-gray-700 rounded-md hover:border-blue-300 hover:bg-blue-300/10 transition-all duration-300">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center border-2 border-gray-700 rounded-md hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center border-2 border-gray-700 rounded-md hover:border-red-500 hover:bg-red-500/10 transition-all duration-300">
                            <Youtube className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-blue-400 transition-colors">About Us</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                    <p className="text-gray-400 text-sm">© 2025 Travesta. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;