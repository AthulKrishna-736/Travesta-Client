import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Travesta</h3>
                        <p className="text-gray-400 max-w-xs">
                            Find the perfect hotel at the best price. Compare rates from all major booking sites.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white">Company</h4>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white">Support</h4>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white">Stay Updated</h4>
                        <p className="text-gray-400">Subscribe to our newsletter for exclusive deals</p>
                        <div className="flex">
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="rounded-r-none focus-visible:ring-blue-400"
                            />
                            <Button className="rounded-l-none bg-blue-500 hover:bg-blue-600">
                                <Mail className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} Travesta. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
